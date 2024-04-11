import { addAlert } from "../ui/components/alert/push.alert";

export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
        .then(function () {
            addAlert('success', 'Text copied to clipboard successfully');
        })
        .catch(function () {
            addAlert('danger', 'Could not copy text: ' + text);
        });
}