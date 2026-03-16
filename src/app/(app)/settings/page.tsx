import { AppSettingForm } from "@/components/forms/app-setting-form";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { EmptyState } from "@/components/empty-state";
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

      <FormSection
        title="Profile settings"
        description="Update personal details, preferences, and optionally rotate your password."
        actions={
          <CreateFormSheet
            triggerLabel="Edit profile"
            title="Profile settings"
            description="Update personal details, preferences, and optional password changes from a focused side panel."
          >
            <SettingsProfileForm profile={profile} />
          </CreateFormSheet>
        }
      />

      <FormSection title="Active sessions" description="Review current refresh sessions and revoke old devices when needed.">
        {sessions.sessions.length ? (
          <div className="grid gap-4">
            {sessions.sessions.map((session) => (
              <div key={session.id} className="flex flex-col gap-3 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 md:flex-row md:items-center md:justify-between sm:p-5">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{session.userAgent ?? "Unknown device"}</p>
                  <p className="mt-1 text-xs text-neutral-500">{session.ipAddress ?? "No IP recorded"} · last used {formatDate(session.lastUsedAt)}</p>
                </div>
                <form action={revokeSessionAction}>
                  <input type="hidden" name="sessionId" value={session.id} />
                  <button className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 md:w-auto">
                    {session.isCurrent ? "Revoke current session" : "Revoke session"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No active sessions"
            description="When refresh sessions are available for your account, they will be listed here for review and revocation."
          />
        )}
      </FormSection>

      {appSettings.items.length ? (
        <FormSection title="App settings" description="Admin-only JSON-backed configuration entries available through the backend settings module.">
          <div className="grid gap-4 md:grid-cols-2">
            {appSettings.items.map((setting) => (
              <div key={setting.key} className="rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-900">{setting.key}</p>
                    <p className="text-sm leading-6 text-neutral-500">
                      Edit and save this JSON-backed configuration inside a focused side panel.
                    </p>
                  </div>
                  <CreateFormSheet
                    triggerLabel="Edit setting"
                    title={setting.key}
                    description="Update the JSON payload for this app-level setting in a dedicated right-side panel."
                    triggerClassName="w-full sm:w-auto"
                    variant="outline"
                  >
                    <AppSettingForm setting={setting} />
                  </CreateFormSheet>
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      ) : null}
    </div>
  );
}
