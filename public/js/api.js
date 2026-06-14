const api = {
  async request(url, options = {}) {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options
    });

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.message || "Erro na requisição.");
    }

    return json.data;
  },

  get(url) {
    return this.request(url);
  },

  post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(url) {
    return this.request(url, {
      method: "DELETE"
    });
  }
};

function mostrarMensagem(texto, tipo = "ok") {
  const msg = document.getElementById("msg");
  if (!msg) return;

  msg.textContent = texto;
  msg.className = `message ${tipo}`;

  setTimeout(() => {
    msg.className = "message";
    msg.textContent = "";
  }, 3500);
}
