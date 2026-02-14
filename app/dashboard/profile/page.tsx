import DeleteAccountButton from "@/components/DeleteAccountButton";
import EditProfileForm from "@/components/EditProfileForm";
import ProfileCountdownGuard from "@/components/ProfileCountdownGuard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_name, about_me")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const fullName = user.user_metadata?.full_name ?? null;
    const userName = user.user_metadata?.user_name ?? null;
    const aboutMe = user.user_metadata?.about_me ?? null;
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      user_name: userName,
      about_me: aboutMe,
    });
    profile = { full_name: fullName, user_name: userName, about_me: aboutMe };
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800">Il tuo profilo</h1>
      <p className="mt-2 text-stone-600">
        Aggiorna nome e nome utente. Questi dati appariranno sulle ricette che
        pubblichi.
      </p>
      <ProfileCountdownGuard>
        <div className="mt-6">
          <EditProfileForm
            userId={user.id}
            initialFullName={profile?.full_name ?? null}
            initialUserName={profile?.user_name ?? null}
            initialAboutMe={profile?.about_me ?? null}
          />
          <DeleteAccountButton />
        </div>
      </ProfileCountdownGuard>
    </div>
  );
}
