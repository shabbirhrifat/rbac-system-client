import { AppSettingForm } from "@/components/forms/app-setting-form";
import { FormSection } from "@/components/forms/form-section";
import { SettingsProfileForm } from "@/components/forms/settings-profile-form";
import { PageHeader } from "@/components/page-header";
import { getAppSettings, getSessions, getSettingsProfile } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { revokeSessionAction } from "@/actions/auth";

export default async function SettingsPage() {
  const [profile, sessions, appSettings] = await Promise.all([
    getSettingsProfile(),
    getSessions(),
    getAppSettings().catch(() => ({ items: [] })),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Profile, sessions, and app controls"
        description="Update your personal settings, review active sessions, and manage admin-only app settings when permitted."
        badge={profile.status}
      />

      <FormSection title="Profile settings" description="Update personal details, preferences, and optionally rotate your password.">
        <SettingsProfileForm profile={profile} />
      </FormSection>

      <FormSection title="Active sessions" description="Review current refresh sessions and revoke old devices when needed.">
        <div className="grid gap-4">
          {sessions.sessions.map((session) => (
            <div key={session.id} className="flex flex-col gap-3 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{session.userAgent ?? "Unknown device"}</p>
                <p className="mt-1 text-xs text-neutral-500">{session.ipAddress ?? "No IP recorded"} · last used {formatDate(session.lastUsedAt)}</p>
              </div>
              <form action={revokeSessionAction}>
                <input type="hidden" name="sessionId" value={session.id} />
                <button className="rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800">
                  {session.isCurrent ? "Revoke current session" : "Revoke session"}
                </button>
              </form>
            </div>
          ))}
        </div>
      </FormSection>

      {appSettings.items.length ? (
        <FormSection title="App settings" description="Admin-only JSON-backed configuration entries available through the backend settings module.">
          <div className="grid gap-4 xl:grid-cols-2">
            {appSettings.items.map((setting) => (
              <AppSettingForm key={setting.key} setting={setting} />
            ))}
          </div>
        </FormSection>
      ) : null}
    </div>
  );
}
