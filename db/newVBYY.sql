select vehicles.id, make, model, year, owner_id, name 
from vehicles
 join users on vehicles.owner_id = users.id
 where year >= 2000
 order by year desc