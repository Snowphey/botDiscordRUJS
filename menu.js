const parse = require("node-html-parser");
const https = require("https");


module.exports = {
    /*
    Retourne un dictionnaire avec les différents menu des jour à venir exemple : 
    {'Menu du mardi 25 octobre 2022': ['Cordon bleu', 'Poisson à la bordelaise', 'Boulette soja tomate', 'Blé pilaf sauce tomate', 'Haricots verts'], 
    'Menu du mercredi 26 octobre 2022': ["Dos de colin d'Alaska sauce basquaise", 'Emincé de porc', 'Purée de potiron', 'Haricots plats'], 
    'Menu du jeudi 27 octobre 2022': ['Poisson meunière', 'Steak haché', 'Frites', 'Brocolis ail/persil']}
    */
    majMenu: async function majMenu() {
        // Définition de l'URL
        options = {
            host: 'www.crous-bordeaux.fr',
            path: '/restaurant/resto-u-pierre-bidart/'
        };

        // Request get de la page 
        return new Promise(function(resolve) {
            https.get(options, function (res) {
                body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                }).on('end', function () {
                    parsedHTML = parse.parse(body);
                
                    element = parsedHTML.querySelector('div[id="menu-repas"]');
                    jour = element.getElementsByTagName("h3");
                    sElement = element.querySelectorAll('div[class="content clearfix"]');

                    tab = [];

                    for (let i of sElement) {
                        if(i.querySelector('ul[class="liste-plats"]') != undefined) {
                            tab.push(i.querySelector('ul[class="liste-plats"]'));
                        }
                    }

                    dico = {};
                    tab.forEach((i, index) => {
                        dico[jour[index].text] = i.getElementsByTagName("li");
                    });

                    for ([jour, infosJour] of Object.entries(dico)) {
                        tab = [];
                        for (let j of infosJour) {
                            if(j.text != "" && j.text != "DESSERT" && j.text != "ENTREE") {
                                tab.push(j.text);
                            }
                        }
                        dico[jour] = tab;
                    }

                    resolve(dico);
                });
            });
        });
    },

    /*
    Retourne un tuple (Date, Tableau des différents plats) du jour
    */
    menuDuJour: function menuDuJour(dico) {
        return Object.entries(dico)[0];
    }
}