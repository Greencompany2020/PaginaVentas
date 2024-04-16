import { SelectInput } from 'components/FormInputs'

/**
 * @typedef {Object.<string, string | number>} ReportsCatalog
 * @property {number} Id
 * @property {string} Tipo
 * @property {string} Nombre
 * @property {string} UrlBase
 * @property {string} Version
 */

/**
 * `SelectInput` para selección de reportes PDF del
 * módulo reposiciones
 * @param {string} label
 * @param {string} name
 * @param {Array<ReportsCatalog>} catalog
 * @constructor
 */
export const PDFReplenishmentCatalogInput = ({ label, name, catalog }) => {
	return (
		<SelectInput label={label} name={name}>
			{catalog.map((item) => (
				<option key={item.Id} value={item.Id}>
					{item.Nombre}
				</option>
			))}
		</SelectInput>
	)
}
