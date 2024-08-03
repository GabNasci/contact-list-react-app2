import { ContactInterface, Type, Option } from "../interface/ContactInterface";
import { ContactSchemaType } from "../App";

function findDuplicate(contacts: Array<ContactInterface>, contact: ContactSchemaType): boolean {
    return contacts.some((item) => {
        if(item.type === contact.type) return (item.email === contact.email || item.phone === contact.phone)
        return (item.email === contact.email && item.phone === contact.phone)
    } )
}

function findByName(contacts: Array<ContactInterface>, search: string): Array<ContactInterface> {
    if(search.length > 0) return contacts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    return contacts
}

function findByEmail(contacts: Array<ContactInterface>, search: string): Array<ContactInterface> {
    if(search.length > 0) return contacts.filter((item) => item.email.includes(search))
    return contacts
}

function findByPhone(contacts: Array<ContactInterface>, search: string): Array<ContactInterface> {
    if(search.length > 0) return contacts.filter((item) => item.phone.includes(search))
    return contacts
}

function filterByType(contacts: Array<ContactInterface>, type: string): Array<ContactInterface> {
    if(type !== Type.All) return contacts.filter((item) => item.type === type)
    return contacts
}

function createContact(contacts: Array<ContactInterface>, contact: ContactSchemaType): Array<ContactInterface> {

    const newArray: Array<ContactInterface> = contacts
    newArray.push({id: contacts.length + 1, ...contact})
    return newArray
}

function searchContact( contacts: Array<ContactInterface>, field: string, search: string, type: string): Array<ContactInterface>{
    if (field === Option.Name) return filterByType(findByName(contacts, search), type)
    if (field === Option.Email) return filterByType(findByEmail(contacts, search), type)
    if (field === Option.Phone) return filterByType(findByPhone(contacts, search), type)
    return contacts
}

function deleteContact(contacts: Array<ContactInterface>, id: number): Array<ContactInterface> {
    const newArray: Array<ContactInterface> = contacts
    newArray.splice(id, 1)
    return newArray
}

export default {
    createContact,
    findDuplicate,
    searchContact,
    filterByType,
    deleteContact
}