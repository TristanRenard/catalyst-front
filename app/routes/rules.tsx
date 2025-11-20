import type { MetaArgs } from "react-router"
import { Link } from "react-router"

export const meta = ({ }: MetaArgs) => {
  return [
    { title: "Règles du Jeu - Catalyst" },
    { name: "description", content: "Découvrez les règles du jeu Catalyst" },
  ]
}

const RulesPage = () => {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#232029' }}>
      <header className="border-b border-gray-800 bg-[#1a1820]">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="Catalyst Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-[#EBDFF0]">Catalyst</span>
          </Link>

          <nav className="flex gap-4">
            <Link
              to="/"
              className="px-5 py-2 bg-[#2a2830] hover:bg-[#3a3840] text-[#EBDFF0] font-semibold rounded-lg border border-gray-800 transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/lobby"
              className="px-6 py-2.5 bg-[#EBDFF0] text-[#2a2830] font-semibold rounded-lg hover:bg-[#df93ff] transition-colors"
            >
              Jouer
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#EBDFF0] mb-4">Règles du Jeu</h1>
          <p className="text-xl text-[#EBDFF0]/70">Maîtrisez les mécaniques de Catalyst</p>
        </div>

        <div className="space-y-6">
          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">🎯 Objectif du Jeu</h2>
            <p className="text-[#EBDFF0]/90 leading-relaxed">
              L'objectif est d'avoir le <strong>moins de points possible</strong> en complétant vos cartes Situation avant la fin des 20 tours. Chaque carte non complétée vous fait gagner des points (ce qui est mauvais !).
            </p>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">🎮 Mise en Place</h2>
            <ul className="space-y-2 text-[#EBDFF0]/90">
              <li className="flex gap-3">
                <span className="text-[#df93ff] font-bold">•</span>
                <span>Chaque joueur reçoit <strong>5 cartes Situation</strong> et <strong>3 cartes Énergie</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#df93ff] font-bold">•</span>
                <span><strong>1 Situation Privée</strong> (face cachée) et <strong>1 Situation Commune</strong> (visible)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#df93ff] font-bold">•</span>
                <span>Un joueur est désigné aléatoirement pour <strong>commencer</strong></span>
              </li>
            </ul>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">⚡ Déroulement d'un Tour</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#EBDFF0] mb-2">1. Phase de Pioche</h3>
                <p className="text-[#EBDFF0]/80 pl-4">Piochez <strong>1 carte Énergie</strong> depuis la pioche ou la défausse (maximum 3 en main)</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#EBDFF0] mb-2">2. Phase d'Action</h3>
                <p className="text-[#EBDFF0]/80 pl-4 mb-2">Choisissez une action :</p>
                <ul className="space-y-2 pl-8 text-[#EBDFF0]/80">
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">→</span>
                    <span><strong>Placer une Énergie</strong> sur une Situation (Commune, votre Privée, ou celle de l'adversaire)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">→</span>
                    <span><strong>Défausser une Énergie</strong> dans la pile de défausse</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">✨ Compléter une Situation</h2>
            <div className="space-y-4 text-[#EBDFF0]/90">
              <p>
                Une Situation est <strong>complétée</strong> quand les <strong>5 énergies requises</strong> sont correctement placées dessus.
              </p>

              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-[#EBDFF0] mb-3">Que se passe-t-il ?</h3>
                <ol className="space-y-2 text-[#EBDFF0]/80">
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">1.</span>
                    <span><strong>L'effet</strong> de la carte est appliqué</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">2.</span>
                    <span>La Situation est <strong>remplacée</strong> par une nouvelle de votre main</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">3.</span>
                    <span>Les énergies placées sont <strong>perdues</strong></span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">🏆 Fin de Partie</h2>
            <div className="space-y-4 text-[#EBDFF0]/90">
              <p>
                La partie se termine après <strong>20 tours</strong>, par abandon, ou par déconnexion.
              </p>

              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-[#EBDFF0] mb-3">Calcul des points</h3>
                <ul className="space-y-2 text-[#EBDFF0]/80">
                  <li className="flex gap-2">
                    <span className="text-[#fe5c5c]">❌</span>
                    <span><strong>Situations NON complétées :</strong> Vous gagnez le quota de points indiqué</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#df93ff]">✓</span>
                    <span><strong>Situations complétées :</strong> Aucun point (c'est bon !)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#fe5c5c]">⚠️</span>
                    <span><strong>Situation Commune :</strong> Donne des points aux DEUX joueurs si non complétée</span>
                  </li>
                </ul>
              </div>

              <div className="text-center bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <p className="text-xl font-bold text-[#EBDFF0]">
                  Le joueur avec le MOINS de points gagne ! 🎉
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">💡 Conseils Stratégiques</h2>
            <ul className="space-y-3 text-[#EBDFF0]/90">
              <li className="flex gap-3">
                <span className="text-[#df93ff] text-xl">1.</span>
                <span><strong>Priorisez votre Situation Privée :</strong> Vous seul recevrez les points si non complétée</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#df93ff] text-xl">2.</span>
                <span><strong>Sabotez l'adversaire :</strong> Placez des énergies incorrectes sur sa Situation Privée</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#df93ff] text-xl">3.</span>
                <span><strong>Gérez votre main :</strong> Gardez des Situations en réserve pour les remplacements</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#df93ff] text-xl">4.</span>
                <span><strong>Surveillez le temps :</strong> 20 tours passent vite, priorisez vos objectifs</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#1a1820] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-[#df93ff] mb-4">❓ Questions Fréquentes</h2>
            <div className="space-y-4">
              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="font-semibold text-[#EBDFF0] mb-2">Puis-je voir la Situation Privée de mon adversaire ?</h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Non, elle est face cachée. Mais vous pouvez y placer des énergies sans savoir lesquelles sont requises.
                </p>
              </div>

              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="font-semibold text-[#EBDFF0] mb-2">Puis-je placer n'importe quelle énergie sur n'importe quelle Situation ?</h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Oui ! Mais la Situation ne sera complétée que si les 5 énergies correspondent exactement aux énergies requises.
                </p>
              </div>

              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="font-semibold text-[#EBDFF0] mb-2">Puis-je retirer des énergies déjà placées ?</h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Non, une fois placée, une énergie ne peut plus être retirée. Choisissez bien !
                </p>
              </div>

              <div className="bg-[#2a2830] rounded-lg p-4 border border-gray-800">
                <h3 className="font-semibold text-[#EBDFF0] mb-2">Que se passe-t-il si la pioche d'Énergies est vide ?</h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Vous devez piocher depuis la défausse. Si elle est aussi vide, vous ne pouvez pas piocher.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#EBDFF0]/70 mb-6 text-lg">Prêt à tester votre stratégie ?</p>
          <Link
            to="/lobby"
            className="inline-block px-10 py-3 bg-[#EBDFF0] text-[#2a2830] text-lg font-bold rounded-lg hover:bg-[#df93ff] transition-colors"
          >
            Commencer une Partie
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-800 bg-[#1a1820] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Catalyst" className="w-8 h-8 object-contain" />
              <span className="text-[#EBDFF0]/70 text-sm">© 2025 Catalyst. Tous droits réservés.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/admin" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Administration
              </Link>
              <Link to="/" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Accueil
              </Link>
              <Link to="/admin/leaderboard" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Classement
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default RulesPage