import React from 'react';

const Impressum: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Impressum</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-6">
              Diese Seite dient als Impressum für nachhilfe-htlwy.netlify.app
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Seitenbetreiber, für den Inhalt verantwortlich:</h2>
                <div className="text-gray-700">
                  <p className="font-medium">Höhere technische Bundeslehr- und Versuchsanstalt Waidhofen an der Ybbs</p>
                  <p>Im Vogelsang 8</p>
                  <p>3340 Waidhofen an der Ybbs, Austria</p>
                  <div className="mt-2">
                    <p>Tel: 07442/52590-0</p>
                    <p>Fax: 07442/52590-264</p>
                    <p>E-Mail: <a href="mailto:office@htlwy.at" className="text-blue-600 hover:text-blue-800">office@htlwy.at</a></p>
                    <p>Facebook: <a href="https://www.facebook.com/HTLWY.AT" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">https://www.facebook.com/HTLWY.AT</a></p>
                  </div>
                </div>
              </section>

              <section>
                <div className="text-gray-700">
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;