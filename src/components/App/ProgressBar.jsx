// components/ProgressBar.tsx
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";

NProgress.configure({ showSpinner: false, trickleSpeed: 100, minimum: 0.08 });

export default function ProgressBar() {
  const router = useRouter();

  useEffect(() => {
    const start = () => NProgress.start();
    const done = () => NProgress.done();

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events]);

  return null;
}