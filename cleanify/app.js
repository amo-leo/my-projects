// app.js

async function ladeAlleLieder(token) {
    let alleLieder = [];
    let naechsteSeite = 'https://api.spotify.com/v1/me/tracks?limit=50';

    while (naechsteSeite) {
        const antwort = await fetch(naechsteSeite, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        // Falls Fehler 429 (Too Many Requests) kommt:
        if (antwort.status === 429) {
            const wartezeit = antwort.headers.get('Retry-After') || 2;
            console.warn(`Spotify-Limit erreicht. Warte ${wartezeit} Sekunden...`);
            await new Promise(res => setTimeout(res, wartezeit * 1000));
            continue; // Versuche es nach der Pause nochmal
        }

        const daten = await antwort.json();
        alleLieder = alleLieder.concat(daten.items);
        naechsteSeite = daten.next; // URL für die nächsten 50 Lieder

        // Kurze "Atempause" für die API (100ms), um 429 vorzubeugen
        await new Promise(res => setTimeout(res, 100));
    }

    console.log("Alle Lieder geladen:", alleLieder.length);
    return alleLieder;
}
