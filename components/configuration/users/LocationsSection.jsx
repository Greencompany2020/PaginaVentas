import React from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { CheckBoxInput } from 'components/FormInputs'
import useToggle from 'hooks/useToggle'

/**
 * @typedef {Object} Location
 * @property {number} Codigo
 * @property {string} Localidad
 * @property {string} Inactiva
 */

/**
 * @param {UserDetailWithoutAccessList | undefined} item
 * @param {Location} locality
 * @param {Array<Store>} shops
 * @returns {JSX.Element}
 * @constructor
 */
export const LocationsSection = ({ item, locality, shops }) => {
	const [isOpen, setIsOpen] = useToggle(false)
	const placeShops = shops.find((item) => item.codigoLocalidad === locality.Codigo)

	return (
		<li className="bg-gray-100 py-2 px-1 rounded-md">
			<div className="flex justify-between items-center cursor-pointer" onClick={setIsOpen}>
				<CheckBoxInput
					id={locality.Codigo}
					name={`[localidades.${locality.Localidad}]`}
					key={locality.Codigo}
					label={locality.Localidad}
				/>
				{isOpen ? <MinusIcon width={18} /> : <PlusIcon width={18} />}
			</div>
			<div className={`${isOpen ? 'h-fit  px-1 py-2' : 'hidden'}`}>
				<ul className="pl-4 space-y-1 bg-white rounded-md">
					{placeShops
						? placeShops.almacenes.map((shop) => (
								<li key={shop.codigo}>
									<CheckBoxInput
										id={shop.codigo}
										name={`[shops.${shop.codigo}]`}
										label={shop.codigo}
										//disabled={!item}
									/>
                  {item}
								</li>
							))
						: null}
				</ul>
			</div>
		</li>
	)
}
