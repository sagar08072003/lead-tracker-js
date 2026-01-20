const STORAGE_KEY = "leads";

let leads = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

const form = document.getElementById("leadForm");
const table = document.getElementById("leadTable");
const searchInput = document.getElementById("search");

function saveLeads() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function renderLeads(filter = "") {
  table.innerHTML = "";

  leads
    .filter(lead =>
      Object.values(lead)
        .join(" ")
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .forEach(lead => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${lead.name}</td>
        <td>${lead.email}</td>
        <td>${lead.company}</td>
        <td class="actions">
          <button class="btn-secondary" data-edit="${lead.id}">Edit</button>
          <button class="btn-danger" data-delete="${lead.id}">Delete</button>
        </td>
      `;

      table.appendChild(row);
    });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const company = form.company.value.trim();

  if (!name || !email) return;

  if (editingId) {
    leads = leads.map(lead =>
      lead.id === editingId ? { ...lead, name, email, company } : lead
    );
    editingId = null;
  } else {
    leads.push({
      id: crypto.randomUUID(),
      name,
      email,
      company
    });
  }

  saveLeads();
  form.reset();
  renderLeads(searchInput.value);
});

table.addEventListener("click", event => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    const lead = leads.find(l => l.id === editId);
    if (!lead) return;

    form.name.value = lead.name;
    form.email.value = lead.email;
    form.company.value = lead.company;
    editingId = editId;
  }

  if (deleteId) {
    leads = leads.filter(lead => lead.id !== deleteId);
    saveLeads();
    renderLeads(searchInput.value);
  }
});

searchInput.addEventListener("input", event => {
  renderLeads(event.target.value);
});

renderLeads();
