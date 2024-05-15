const ADMIN_LINKS = [
    { to: "supervisors", text: "Supervisors" },
    { to: "settings", text: "Site Settings" },
    { to: "site-admin", text: "Site Admin" },
    { to: "cv", text: "Upload CV" },
    { to: "publications", text: "Publications" },
    { to: "peoples", text: "Peoples" },
    { to: "projects-items", text: "Projects Items" },
    { to: "datasets", text: "Datasets" },
    { to: "news", text: "News" },
    { to: "slider-images", text: "Slider Images" },
    { to: "gallary-images", text: "Gallery Images" },
    { to: "research", text: "Research Areas" },
    { to: "projects", text: "Research Projects" },
    { to: "change-password", text: "Change Password" },
];
const ADMIN_SUPERVISOR_LINKS = [
    { to: "", text: "Home" },
    ...ADMIN_LINKS
];

const ADMIN_PHD_LINKS = [
    { to: "", text: "Home" },
    { to: "profile-phd", text: "My Profile" },
    ...ADMIN_LINKS
];

const SUPERVISOR_LINKS = [
    { to: "", text: "Home" },
    { to: "profile-phd", text: "My Profile" },
    { to: "cv", text: "Upload CV" },
    { to: "site-admin", text: "Site Admin" },
    { to: "publications", text: "Publications" },
    { to: "peoples", text: "Peoples" },
    { to: "projects-items", text: "Projects Items" },
    { to: "research", text: "Research Areas" },
    { to: "projects", text: "Research Projects" },
    { to: "datasets", text: "Datasets" },
    { to: "change-password", text: "Change Password" },
];

const PHD_LINKS = [
    { to: "", text: "Home" },
    { to: "profile-phd", text: "My Profile" },
    { to: "cv", text: "Upload CV" },
    { to: "site-admin", text: "Site Admin" },
    { to: "publications", text: "Publications" },
    { to: "projects-items", text: "Research Topics" },
    { to: "change-password", text: "Change Password" },
];


export { ADMIN_PHD_LINKS, ADMIN_SUPERVISOR_LINKS, PHD_LINKS, SUPERVISOR_LINKS };