import { updatePortalProfileAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProfileSettings } from "@/types/api";

export function PortalProfileForm({ profile }: { profile: ProfileSettings }) {
  return (
    <form action={updatePortalProfileAction} className="grid gap-4">
      <div className="form-grid">
        <label className="space-y-2"><span className="field-label">First name</span><Input name="firstName" defaultValue={profile.firstName} /></label>
        <label className="space-y-2"><span className="field-label">Last name</span><Input name="lastName" defaultValue={profile.lastName} /></label>
        <label className="space-y-2 md:col-span-2"><span className="field-label">Phone</span><Input name="phone" defaultValue={profile.phone ?? ""} /></label>
      </div>
      <Button type="submit" className="w-full md:w-fit">Save portal profile</Button>
    </form>
  );
}
