import { person } from "../content";
import { Icon } from "./Icon";
import { useToast } from "./Layout";

/** Copies the email address and confirms with a toast; falls back to opening the mail app. */
export function CopyEmailButton({ className = "" }: { className?: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className={className}
      data-testid="copy-email"
      aria-label={`Copy email address ${person.email}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(person.email);
          toast("Email address copied");
        } catch {
          window.location.href = `mailto:${person.email}`;
        }
      }}
    >
      <Icon name="copy" className="size-5" />
    </button>
  );
}
