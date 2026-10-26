export const TOUR_URL = '/3d/viewer/index.html'; // Paketi README-s toodud iframe-aadress.
export const apartmentDetails = { rooms: 3, area: '72,4', balcony: '8,2', price: '249 000', status: 'Vaba', description: 'Valgusküllane kodu, kus avatud elutuba ja köök kohtuvad avara rõduga. Kaks rahulikku magamistuba, läbimõeldud panipaigad ja suured aknad loovad ruumi sinu igapäevaelule.' };
const floorCount=12;
export const building = { id: 'pargi-7', name: 'Pargi 7', floors: Array.from({length:floorCount},(_,i)=>i+1), apartments: Array.from({length:floorCount*4}, (_,i) => ({number:i+1, floor:Math.floor(i/4)+1, position:i%4, details:apartmentDetails})) };
export const districts = [{id:'a',name:'Linnaosa A',building},{id:'b',name:'Linnaosa B',building}];
export function readRoute(search: string) {
 const p = new URLSearchParams(search);
 const district = districts.find(d=>d.id===p.get('linnaosa'));
 const house = district && p.get('hoone')===building.id;
 const apartment = house ? building.apartments.find(a=>a.number===Number(p.get('korter'))) : undefined;
 const floor=apartment?.floor ?? (house && building.floors.includes(Number(p.get('korrus'))) ? Number(p.get('korrus')) : 1);
 return {district,house,apartment,floor};
}


