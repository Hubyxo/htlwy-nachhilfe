import React from 'react';

const Datenschutz: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Haftungsausschluss</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Inhalte</h3>
              <p className="text-gray-700">
                Wir übernehmen keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt. Alle Angebote sind freibleibend und unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Urheber- und Nutzungsrechte</h2>
              <p className="text-gray-700">
                Sämtliche Inhalte wie Texte, Bilder, Grafiken, Animationen, Videos, Sound oder sonstige Materialien dieser Website sind, sofern nicht anders angegeben, unser Eigentum oder Eigentum unserer Partner bzw. haben wir das Nutzungsrecht dafür. Sämtliche unter dieser Domain bzw. in diesem Webangebot gehosteten Materialien dürfen nicht ohne ausdrückliche Zustimmung anderweitig verwendet werden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Genderhinweis</h2>
              <p className="text-gray-700">
                Aus Gründen der einfacheren Lesbarkeit wird auf die geschlechtsspezifische Differenzierung verzichtet. Entsprechende Begriffe gelten im Sinne der Gleichbehandlung grundsätzlich für beide Geschlechter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Barrierefreiheit</h2>
              <p className="text-gray-700">
                Wir versuchen unser bestes, diese Website hinsichtlich der Barrierefreiheit zu optimieren. Wenn Sie trotz unseres Bemühens auf Schwierigkeiten stoßen oder Anregungen zur Verbesserung haben, freuen wir uns über Ihr Feedback unter den oben angegebenen Kontaktdaten.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;