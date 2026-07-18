import { useEffect } from "react";
import { toast } from "sonner";

export function useUpdateReadyToast() {
  useEffect(() => {
    const unsubscribe = window.electronAPI.onUpdateReady(({ version }) => {
      toast("アップデートの準備ができました", {
        description: version,
        duration: Infinity,
        action: {
          label: "再起動して更新",
          onClick: () => {
            void window.electronAPI.installUpdate();
          },
        },
      });
    });
    return unsubscribe;
  }, []);
}
