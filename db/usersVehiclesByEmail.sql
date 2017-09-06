select vehicles.id, make, model, year 
from vehicles
join users on vehicles.owner_id = users.id
where email = $1; 