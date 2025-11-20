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
    <main className="relative min-h-screen bg-linear-to-br from-[#1a1820] via-[#2a2435] to-[#1a1820]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#df93ff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#fe5c5c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,147,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(223,147,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      <header className="relative z-10 border-b border-[#3a3840] bg-[#1a1820]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="Catalyst" className="w-10 h-10 object-contain opacity-80" />
            <h1 className="text-3xl font-bold text-[#EBDFF0]">Règles du Jeu</h1>
          </div>
          <Link
            to="/"
            className="px-6 py-2.5 bg-[#2a2830]/80 hover:bg-[#2a2830] text-[#EBDFF0] font-semibold rounded-full border border-[#3a3840] hover:border-[#df93ff] transition-all duration-300"
          >
            ← Retour
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#df93ff] to-[#fe5c5c] rounded-2xl mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-xl text-[#EBDFF0]/70 max-w-2xl mx-auto">
            Un jeu de stratégie pour 2 joueurs où l'objectif est d'avoir le moins de points possible
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#df93ff]/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-[#df93ff]">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-[#EBDFF0]">But du jeu</h3>
            </div>
            <p className="text-[#EBDFF0]/70 text-sm leading-relaxed">
              Avoir le <strong className="text-[#df93ff]">moins de points</strong> possible en complétant vos cartes Situation avant la fin des 20 tours.
            </p>
          </div>

          <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#fe5c5c]/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-[#fe5c5c]">🎴</span>
              </div>
              <h3 className="text-lg font-bold text-[#EBDFF0]">Matériel</h3>
            </div>
            <p className="text-[#EBDFF0]/70 text-sm leading-relaxed">
              <strong className="text-[#fe5c5c]">Cartes Situation</strong> (5 emplacements, 1 effet, 1 quota) et <strong className="text-[#fe5c5c]">Cartes Énergie</strong> (picto + couleur).
            </p>
          </div>

          <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#df93ff]/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-[#df93ff]">⏱️</span>
              </div>
              <h3 className="text-lg font-bold text-[#EBDFF0]">Durée</h3>
            </div>
            <p className="text-[#EBDFF0]/70 text-sm leading-relaxed">
              <strong className="text-[#df93ff]">20 tours maximum</strong>. Chaque joueur joue alternativement en piochant et en plaçant des énergies.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Mise en place
            </h2>
            <div className="space-y-4 text-[#EBDFF0]/80">
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 bg-[#df93ff]/20 rounded-full flex items-center justify-center text-[#df93ff] font-bold">1</span>
                <p><strong>Distribution :</strong> Chaque joueur reçoit 5 cartes Situation + 3 cartes Énergie</p>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 bg-[#df93ff]/20 rounded-full flex items-center justify-center text-[#df93ff] font-bold">2</span>
                <p><strong>Situations :</strong> 1 carte Situation placée face cachée (Privée) + 1 carte commune face visible</p>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 bg-[#df93ff]/20 rounded-full flex items-center justify-center text-[#df93ff] font-bold">3</span>
                <p><strong>Premier joueur :</strong> Déterminé aléatoirement</p>
              </div>
            </div>
          </section>

          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              Tour de jeu
            </h2>
            <div className="space-y-6">
              <div className="bg-[#1a1820]/50 rounded-xl p-6 border-l-4 border-[#df93ff]">
                <h3 className="text-lg font-bold text-[#df93ff] mb-3">Phase 1 : Piocher</h3>
                <p className="text-[#EBDFF0]/80">
                  Piochez <strong>1 carte Énergie</strong> depuis la pioche ou la défausse
                  <br />
                  <span className="text-sm text-[#EBDFF0]/60">⚠️ Limite : Maximum 3 cartes Énergie en main</span>
                </p>
              </div>

              <div className="bg-[#1a1820]/50 rounded-xl p-6 border-l-4 border-[#fe5c5c]">
                <h3 className="text-lg font-bold text-[#fe5c5c] mb-3">Phase 2 : Placer ou Défausser</h3>
                <p className="text-[#EBDFF0]/80 mb-3">Choisissez une action :</p>
                <ul className="space-y-2 text-[#EBDFF0]/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#df93ff] mt-1">▸</span>
                    <span><strong>Placer</strong> une Énergie sur une Situation (Commune, votre Privée, ou celle de l'adversaire)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#df93ff] mt-1">▸</span>
                    <span><strong>Défausser</strong> une Énergie dans la pile de défausse</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">✨</span>
              Compléter une Situation
            </h2>
            <div className="space-y-4 text-[#EBDFF0]/80">
              <p className="text-lg">
                Une Situation est <strong className="text-[#df93ff]">complétée</strong> quand les <strong>5 énergies requises</strong> sont placées dessus.
              </p>
              <div className="bg-[#1a1820]/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#EBDFF0] mb-4">Que se passe-t-il ensuite ?</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 text-[#df93ff] font-bold">1.</span>
                    <span><strong className="text-[#df93ff]">Appliquer l'effet</strong> de la carte sur le joueur cible</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-[#df93ff] font-bold">2.</span>
                    <span><strong className="text-[#df93ff]">Remplacer</strong> la Situation par une nouvelle carte de votre main</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-[#df93ff] font-bold">3.</span>
                    <span>Les énergies placées sont <strong className="text-[#fe5c5c]">perdues</strong></span>
                  </li>
                </ol>
              </div>
              <p className="text-sm text-[#EBDFF0]/60 italic bg-[#df93ff]/10 rounded-lg p-4 border border-[#df93ff]/20">
                💡 Astuce : Vous ne pouvez pas remplacer la Situation Privée de l'adversaire, seulement y placer des énergies !
              </p>
            </div>
          </section>

          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Fin de partie
            </h2>
            <div className="space-y-4">
              <p className="text-[#EBDFF0]/80">
                La partie se termine après <strong className="text-[#df93ff]">20 tours</strong>, par abandon, ou par déconnexion.
              </p>

              <div className="bg-[#1a1820]/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#EBDFF0] mb-4">Calcul des points</h3>
                <div className="space-y-3 text-[#EBDFF0]/70">
                  <div className="flex items-start gap-3 p-3 bg-[#fe5c5c]/10 rounded-lg border border-[#fe5c5c]/20">
                    <span className="text-[#fe5c5c] text-xl">❌</span>
                    <div>
                      <strong className="text-[#fe5c5c]">Situations NON complétées :</strong>
                      <p className="text-sm mt-1">Vous recevez le <strong>quota</strong> de points indiqué sur la carte</p>
                      <p className="text-xs mt-1 opacity-70">⚠️ La Situation Commune donne des points aux DEUX joueurs si non complétée</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#df93ff]/10 rounded-lg border border-[#df93ff]/20">
                    <span className="text-[#df93ff] text-xl">✓</span>
                    <div>
                      <strong className="text-[#df93ff]">Situations complétées :</strong>
                      <p className="text-sm mt-1">Aucun point reçu !</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-[#df93ff]/20 to-[#fe5c5c]/20 rounded-xl p-6 border border-[#df93ff]/30 text-center">
                <p className="text-2xl font-bold text-[#EBDFF0] mb-2">
                  Le joueur avec le MOINS de points gagne ! 🎉
                </p>
                <p className="text-sm text-[#EBDFF0]/60">
                  En cas d'égalité : Le premier à avoir reçu des points perd
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Conseils stratégiques
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#1a1820]/50 rounded-xl p-5 border border-[#df93ff]/20">
                <h3 className="text-[#df93ff] font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span>
                  Priorisez votre Situation Privée
                </h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Vous seul recevrez les points si elle n'est pas complétée
                </p>
              </div>

              <div className="bg-[#1a1820]/50 rounded-xl p-5 border border-[#fe5c5c]/20">
                <h3 className="text-[#fe5c5c] font-bold mb-2 flex items-center gap-2">
                  <span>🎭</span>
                  Sabotez l'adversaire
                </h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Placez des énergies incorrectes sur sa Situation Privée
                </p>
              </div>

              <div className="bg-[#1a1820]/50 rounded-xl p-5 border border-[#df93ff]/20">
                <h3 className="text-[#df93ff] font-bold mb-2 flex items-center gap-2">
                  <span>🃏</span>
                  Gérez votre main
                </h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  Gardez des Situations en réserve pour les remplacements
                </p>
              </div>

              <div className="bg-[#1a1820]/50 rounded-xl p-5 border border-[#fe5c5c]/20">
                <h3 className="text-[#fe5c5c] font-bold mb-2 flex items-center gap-2">
                  <span>⏰</span>
                  Surveillez le temps
                </h3>
                <p className="text-sm text-[#EBDFF0]/70">
                  20 tours passent vite, priorisez vos objectifs
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-8 border border-[#3a3840]">
            <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6 flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              <details className="bg-[#1a1820]/50 rounded-xl overflow-hidden group">
                <summary className="cursor-pointer p-4 text-[#EBDFF0] font-semibold hover:bg-[#1a1820] transition-colors">
                  Puis-je voir la Situation Privée de mon adversaire ?
                </summary>
                <div className="p-4 pt-0 text-[#EBDFF0]/70 text-sm">
                  Non, elle est face cachée. Mais vous pouvez y placer des énergies sans savoir lesquelles sont requises.
                </div>
              </details>

              <details className="bg-[#1a1820]/50 rounded-xl overflow-hidden group">
                <summary className="cursor-pointer p-4 text-[#EBDFF0] font-semibold hover:bg-[#1a1820] transition-colors">
                  Puis-je placer n'importe quelle énergie sur n'importe quelle Situation ?
                </summary>
                <div className="p-4 pt-0 text-[#EBDFF0]/70 text-sm">
                  Oui ! Mais la Situation ne sera complétée que si les 5 énergies correspondent exactement aux énergies requises.
                </div>
              </details>

              <details className="bg-[#1a1820]/50 rounded-xl overflow-hidden group">
                <summary className="cursor-pointer p-4 text-[#EBDFF0] font-semibold hover:bg-[#1a1820] transition-colors">
                  Puis-je retirer des énergies déjà placées ?
                </summary>
                <div className="p-4 pt-0 text-[#EBDFF0]/70 text-sm">
                  Non, une fois placée, une énergie ne peut plus être retirée. Choisissez bien !
                </div>
              </details>

              <details className="bg-[#1a1820]/50 rounded-xl overflow-hidden group">
                <summary className="cursor-pointer p-4 text-[#EBDFF0] font-semibold hover:bg-[#1a1820] transition-colors">
                  Que se passe-t-il si la pioche d'Énergies est vide ?
                </summary>
                <div className="p-4 pt-0 text-[#EBDFF0]/70 text-sm">
                  Vous devez piocher depuis la défausse. Si elle est aussi vide, vous ne pouvez pas piocher.
                </div>
              </details>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-linear-to-r from-[#df93ff]/20 to-[#fe5c5c]/20 rounded-2xl p-8 border border-[#df93ff]/30">
            <h3 className="text-2xl font-bold text-[#EBDFF0] mb-4">
              Prêt à jouer ?
            </h3>
            <p className="text-[#EBDFF0]/70 mb-6">
              Maintenant que vous connaissez les règles, il est temps de tester vos stratégies !
            </p>
            <Link
              to="/lobby"
              className="inline-flex items-center gap-3 px-10 py-4 bg-linear-to-r from-[#df93ff] to-[#fe5c5c] text-white text-lg font-bold rounded-2xl shadow-[0_0_40px_rgba(223,147,255,0.3)] hover:shadow-[0_0_60px_rgba(223,147,255,0.6)] transition-all duration-300 hover:scale-105"
            >
              Commencer à jouer
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-[#3a3840] bg-[#1a1820]/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Catalyst" className="w-8 h-8 object-contain opacity-70" />
              <span className="text-[#EBDFF0]/70 text-sm">© 2025 Catalyst. Tous droits réservés.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Accueil
              </Link>
              <Link to="/lobby" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Jouer
              </Link>
              <Link to="/admin" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Administration
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default RulesPage