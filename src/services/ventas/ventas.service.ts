import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'

import { IConfig } from '@config/vars'
import { TYPES } from '../../config/ioc/types'
import { ICrearVenta, IVenta } from '@models/venta.model'
import { IVentaForProducto } from '@models/ventaForProducto.model'

import { IVentasService } from './index'
import { IGlobalService } from '../globales'
import { IProducto } from '~/models/producto.model'
import { Productos } from '../productos/productos.service'
import { IDBService } from '../db'
import { ICategoriasService } from '../categorias'

@provide(TYPES.IVentasService)
export class Ventas implements IVentasService {
  private factura: string = ''
  private consecutivo: string = ''
  private venta: IVenta | undefined
  constructor(
    @inject(TYPES.IConfig)
    private config: IConfig,
    @inject(TYPES.IGlobalService)
    private global: IGlobalService,
    @inject(TYPES.IDBService)
    private db: IDBService,
    @inject(TYPES.ICategoriasService)
    private categoria: ICategoriasService
  ) {}

  public async crearVenta(payload: ICrearVenta): Promise<string> {
    try {
      const idVenta = this.crearConsecutivo()

      this.venta = {
        totalVenta: payload.valorVenta,
        fecha: payload.fecha,
        idCliente: payload.clienteId,
        idVentaForProducto: await this.crearVentaForProducto(
          idVenta,
          payload.productos
        ),
        id: idVenta,
      }

      await this.db.writeDB({
        type: 'ventas',
        payload: this.venta,
      })

      await this.crearFactura(payload.productos, payload.clienteId)
      return this.factura
    } catch (err) {
      throw new Error('Error creando la venta')
    }
  }

  public async reporte(payload: {
    tipo: 'total' | 'totalProducto' | 'producto'
    producto: string
  }): Promise<string> {
    switch (payload.tipo) {
      case 'total':
        return this.crearTotalVentas()
      case 'totalProducto':
        return this.crearTotalForProductos()
      case 'producto':
        return this.crearTotalParaProducto(payload.producto)
    }
  }

  private async crearTotalVentas(): Promise<string> {
    const ventas: any = await this.traerVentas()
    if (ventas.length === 0) {
      return `
      <ion-content>
      <ion-item>
        <ion-label><b>Total Ventas</b></ion-label><br><br>
      </ion-item>
  
      <ion-item>
        <ion-label><b>Cantidad de Productos Vendidos: </b></ion-label>
        <ion-label slot="end">${ventas.length}</ion-label>
      </ion-item>
  
      <ion-item>
        <ion-label><b>Total Vendido</b></ion-label>
        <ion-label slot="end">$${0}</ion-label>
      </ion-item>
    </ion-content> `
    }

    let total: any = 0
    ventas.map((venta: IVenta) => {
      total += venta.totalVenta
    })
    total = this.formatCurrency(total.toString())
    return `
    <ion-content>
    <ion-item>
      <ion-label><b>Total Ventas</b></ion-label><br><br>
    </ion-item>

    <ion-item>
      <ion-label><b>Cantidad de Productos Vendidos: </b></ion-label>
      <ion-label slot="end">${ventas.length}</ion-label>
    </ion-item>

    <ion-item>
      <ion-label><b>Total Vendido</b></ion-label>
      <ion-label slot="end">${total}</ion-label>
    </ion-item>
  </ion-content> `
  }

  private async crearTotalForProductos(): Promise<string> {
    const ventas: any = await this.traerVentas()
    return ''
  }

  private async crearTotalParaProducto(idProducto: string): Promise<string> {
    const ventasProductos: any = await this.traerVentasPorProductos()
    let cantidad = 0
    ventasProductos.map((ventaProductos: IVentaForProducto) => {
      const producutoFilter: any = ventaProductos.productos.filter(
        producto => producto.id === idProducto
      )
      if (producutoFilter.length > 0) {
        cantidad += producutoFilter[0].cantidadComprada
      }
    })
    const productosClass = new Productos(
      this.config,
      this.global,
      this.db,
      this.categoria
    )
    const dataProducto: [IProducto] = (await productosClass.getProductoById(
      idProducto
    )) as any

    let totalVenta: string = (
      cantidad * dataProducto[0].valor_pesos_colombianos
    ).toString()
    totalVenta = this.formatCurrency(totalVenta)
    return `
    <ion-content>
    <ion-item>
      <ion-label><b>Total Venta Para ${dataProducto[0].nombre_producto}</b></ion-label><br><br>
    </ion-item>

    <ion-item>
      <ion-label><b>Cantidad vendida: </b></ion-label>
      <ion-label slot="end">${cantidad}</ion-label>
    </ion-item>

    <ion-item>
      <ion-label><b>Total Vendido:</b></ion-label>
      <ion-label slot="end">${totalVenta}</ion-label>
    </ion-item>
  </ion-content> `
  }

  private async crearVentaForProducto(
    idVenta: string,
    productos: [{ id: string; cantidadComprada: number }]
  ): Promise<string> {
    let productosVendidos: IVentaForProducto
    const id: string = this.crearConsecutivo()
    productosVendidos = {
      id,
      idVenta,
      productos,
    }

    const result = await this.db.writeDB({
      type: 'ventaForProducto',
      payload: productosVendidos,
    })
    if (!result) {
      throw new Error('Error en crear la venta asociada a los productos')
    }
    return id
  }

  private crearConsecutivo(): string {
    return this.global.crearUUID()
  }

  private async crearFactura(
    productos: [{ id: string; cantidadComprada: number }],
    idCliente: string
  ): Promise<string> {
    const productosDetail = await this.traerProductos(productos)
    const totalVenta = this.formatCurrency(
      this.venta?.totalVenta.toString() || '0'
    )
    const ventas = await this.traerVentas()
    const facturaNVenta = ventas.length

    let productosPrecios = ''
    productosDetail.map(producto => {
      productosPrecios += `
      <ion-row>
          <ion-col> ${producto.nombre} (x${producto.cantidad}) : </ion-col>
          <ion-col> ${this.formatCurrency(producto.total)} </ion-col>
      </ion-row>
      `
    })

    this.factura = `
    <ion-content>
    <ion-item>
      <ion-label><b>Factura de Venta # ${facturaNVenta}</b></ion-label><br><br>
    </ion-item>

    <ion-item>
      <ion-label><b>Fecha:</b></ion-label>
      <ion-label slot="end">${this.venta?.fecha}</ion-label>
    </ion-item>

    <ion-item>
      <ion-label><b>Documento del cliente:</b></ion-label>
      <ion-label slot="end">${this.venta?.idCliente}</ion-label>
    </ion-item>

    <ion-item>
      <ion-label><b>Productos Adquiridos:</b></ion-label>
    </ion-item>

    <ion-item>
      <ion-grid style="text-align: center;">
        ${productosPrecios}
      </ion-grid>
    </ion-item>
    <ion-item>
      <ion-label>
        <b>Total de la venta:</b>
      </ion-label>
      <ion-label slot="end"><b>${totalVenta}</b></ion-label>
    </ion-item>
  </ion-content> `
    return this.factura
  }

  private async traerProductos(
    productos: [{ id: string; cantidadComprada: number }]
  ): Promise<Array<{ nombre: string; cantidad: number; total: string }>> {
    try {
      let productosComprados: Array<{
        nombre: string
        cantidad: number
        total: string
      }> = []
      const promeas = await Promise.all(
        productos.map(async producto => {
          const productosClass = new Productos(
            this.config,
            this.global,
            this.db,
            this.categoria
          )
          const dataProducto: [
            IProducto
          ] = (await productosClass.getProductoById(producto.id)) as any

          productosComprados.push({
            nombre: dataProducto[0].nombre_producto,
            cantidad: producto.cantidadComprada,
            total: (
              producto.cantidadComprada *
              dataProducto[0].valor_pesos_colombianos
            ).toString(),
          })
        })
      )
      return productosComprados
    } catch (err) {
      console.log('Error en traer products::', err)
      throw new Error('Error al traer la info de los productos:')
    }
  }

  private async traerVentas(): Promise<any> {
    const ventas = (await this.db.lecturaDB({
      type: 'ventas',
      payload: '',
    })) as any
    return ventas
  }

  private async traerVentasPorProductos(): Promise<any> {
    const ventas = (await this.db.lecturaDB({
      type: 'ventaForProducto',
      payload: '',
    })) as any
    return ventas
  }

  private formatCurrency(input: string): string {
    const floatValue = parseFloat(input)
    if (isNaN(floatValue)) {
      return 'Invalid input'
    }

    // Formatear el número como moneda
    const formattedValue = floatValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    return formattedValue
  }
}
