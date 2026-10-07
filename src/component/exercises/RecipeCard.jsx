// src/components/exercises/RecipeCard.jsx
import { useState, useEffect } from "react";

export default function RecipeCard() {
  // 1. Stati reattivi locali
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Recuperare i dati al montaggio del componente
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        setError(null);

        // Fake ritardo di 2 secondi
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Endpoint REST reale (senza il /docs/)
        const response = await fetch("https://dummyjson.com/recipes?limit=12");

        // Gestione difensivo: errore fetch NON avvia la chiamata in 404 o 500
        if (!response.ok) {
          throw new Error(
            `Risposta non valida ricevuta dal server con codice ${response.status}`,
          );
        }

        const data = await response.json();

        // In DummyJSON la collezione viene sotto la proprietà .recipes
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error("Errore rilevato nella richiesta: ", err.message);
        setError(
          "Non è stato possibile caricare le ricette. Per favore, riprova più tardi.",
        );
      } finally {
        // Viene eseguito SEMPRE alla fine (con successo o con fallimento)
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, []); // [] assicura che venga eseguito solo al primo render (mounting)

  return (
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="h4 fw-bold text-dark mb-0">
          Catalogo di Ricette (DummyJSON)
        </h2>
        <span className="badge bg-secondary">
          {isLoading ? "Consultando..." : `${recipes.length} ricette`}
        </span>
      </div>

      {/* 1. Feedback Visual: Loader / Spinner */}
      {isLoading && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">
            Controllando ricette al server...
          </p>
        </div>
      )}

      {/* 2. Feedback Visual: Messaggio di Errore */}
      {error && !isLoading && (
        <div className="alert alert-danger shadow-sm border-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* 3. Rendering dell'elenco delle ricette */}
      {!isLoading && !error && (
        <div className="row g-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={recipe.image}
                    className="card-img-top"
                    alt={recipe.name}
                    style={{ height: "200px", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-info text-dark">
                        {recipe.cuisine}
                      </span>
                      <small className="text-muted fw-bold">
                        {recipe.difficulty}
                      </small>
                    </div>
                    <h5 className="card-title text-dark fw-bold mb-2">
                      {recipe.name}
                    </h5>
                    <p className="card-text text-secondary small flex-grow-1">
                      ⏱ Preparazione: {recipe.prepTimeMinutes}m | Cottura:{" "}
                      {recipe.cookTimeMinutes}m
                    </p>
                    <div className="mt-3">
                      <button className="btn btn-outline-primary btn-sm w-100">
                        Vedi Dettagli #{recipe.id}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">
                Nessuna ricetta disponibile.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
