document.addEventListener("DOMContentLoaded", () => {
  const rewardContainer = document.getElementById("rewardContainer");

  if (rewardContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Call your method here
          onRewardContainerShown();
        }
      });
    });

    observer.observe(rewardContainer);
  }
});

const onRewardContainerShown = () => {
  console.log("Reward container is shown");
  // Your method logic here
};
