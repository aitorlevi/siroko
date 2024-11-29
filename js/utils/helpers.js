export const updateText = (newData) => {
  const stepPill = document.getElementById("stepPill");
  const headerTitle = document.getElementById("headerTitle");
  const labelStep = document.getElementById("labelStep");

  stepPill.textContent = newData.pill;
  headerTitle.textContent = newData.title;
  labelStep.textContent = newData.label_step;
};
