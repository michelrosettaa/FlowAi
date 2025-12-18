const { data: session } = useSession();

useEffect(() => {
  if (!session?.user) return;

  fetch("/api/user/profile")
    .then(res => res.json())
    .then(data => {
      if (!data.onboardingCompleted) {
        router.push("/onboarding");
      }
    });
}, [session]);
