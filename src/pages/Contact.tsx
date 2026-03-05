import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kontakt</h1>
          <p className="text-lg text-gray-600 mb-12">
            Hast du Fragen zur Plattform oder zum Nachhilfeprogramm? Melde dich gerne bei uns!
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Kontaktinformationen</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Adresse</h3>
                  <p className="text-gray-600">HTL Waidhofen/Ybbs</p>
                  <p className="text-gray-600">Im Vogelsang 8</p>
                  <p className="text-gray-600">3340 Waidhofen an der Ybbs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">E-Mail</h3>
                  <p className="text-gray-600">office@htlwy.at</p>
                  <p className="text-gray-600">nachhilfe@htlwy.at <span className="text-gray-400 text-sm">(Plattform)</span></p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Telefon</h3>
                  <p className="text-gray-600">+43 7442 52590</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Öffnungszeiten</h3>
                  <p className="text-gray-600">Montag - Donnerstag: 07:30 - 16:30 Uhr</p>
                  <p className="text-gray-600">Freitag: 07:30 - 14:00 Uhr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;