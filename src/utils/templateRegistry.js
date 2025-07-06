export const templates = [
  { name: "Template", component: () => import("../components/templates/Template") },
];

export const getTemplate = () => {
  return templates;
};
