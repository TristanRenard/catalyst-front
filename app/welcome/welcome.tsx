import { Link } from "react-router";

export function Welcome() {
    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            {/* Bouton Login en haut à droite */}
            <div className="absolute top-4 right-4">
                <Link to="/login">
                    <button className="px-6 py-2 bg-[#fe5c5c] text-white font-semibold rounded-lg hover:bg-[#ff7676] transition-colors duration-200 shadow-md hover:shadow-lg">
                        Login
                    </button>
                </Link>
            </div>

            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200" role="img" aria-labelledby="catalyst-logo" className="max-w-full h-auto">
                    <title id="catalyst-logo">Catalyst - Double contour</title>
                    <defs>
                        <style>
                            {`.card-double { fill: #f7b8d0; stroke: #d18ca8; stroke-width: 4; }
              .diamond-outline { fill: none; stroke: #ffffff; stroke-width: 5; }
              .text-red5 { fill: #fe5c5c; font-family: "Poppins", "Montserrat", system-ui, sans-serif; font-weight: 700; }`}
                        </style>
                    </defs>

                    <g transform="translate(120, 0)">
                        {/* Carte avec double contour */}
                        <rect className="card-double" x="30" y="40" width="80" height="120" rx="8"/>
                        <polygon className="diamond-outline" points="70,70 90,100 70,130 50,100"/>

                        {/* Text */}
                        <text x="150" y="125" className="text-red5" fontSize="95">Catalyst</text>
                    </g>
                </svg>

                <h1 className="leading-6 text-gray-700 dark:text-gray-200 text-center text-3xl">
                    Welcome to Catalyst !
                </h1>
            </div>
        </main>
    );
}