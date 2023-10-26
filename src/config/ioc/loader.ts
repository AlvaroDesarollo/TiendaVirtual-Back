import { buildProviderModule, container } from './inversify.config'

/* REST Controllers */
import '../../routes/v1/productos/productos.controller'
import '../../routes/v1/ventas/ventas.controller'
import '../../routes/v1/clientes/clientes.controller'
import '../../routes/v1/categorias/categoria.controller'
import '../../routes/v1/proveedores/proveedores.controller'

/* Services */
import '../../services/db/db.service'
import '../../services/productos/productos.service'
import '../../services/db/json/json.service'
import '../../services/ventas/ventas.service'
import '../../services/globales/globales.service'
import '../../services/clientes/clientes.service'
import '../../services/categorias/categorias.service'
import '../../services/proveedores/proveedor.service'

container.load(buildProviderModule())
