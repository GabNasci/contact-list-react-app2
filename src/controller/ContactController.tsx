import { ContactInterface, Type, Option } from "../interface/ContactInterface";
import { ContactSchemaType } from "../Schema/ContactSchema";

function findDuplicate(contacts: Array<ContactInterface>, contact: ContactSchemaType): boolean {
    return contacts.some((item) => {
        if(item.type === contact.type) return (item.email === contact.email || item.phone === contact.phone)
        return (item.email === contact.email && item.phone === contact.phone)
    } )
}

function findDuplicateEdit(contacts: Array<ContactInterface>, contact: ContactSchemaType, id: number | undefined): boolean {
    return contacts.some((item) => {
        if(item.id === id ) return false
        return (item.email === contact.email || item.phone === contact.phone)
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
    const newArray: Array<ContactInterface> = contacts.filter((item) => item.id !== id)
    return newArray
}

function updateContact(contacts: Array<ContactInterface>, contact: ContactSchemaType, id: number): Array<ContactInterface>{
    const newArray: Array<ContactInterface> = contacts
    return newArray.splice(findIndex(contacts, id), 1, {id: id, ...contact})
}

function findIndex(contacts: Array<ContactInterface>, id: number): number {
    return contacts.findIndex((item) => item.id === id)
}

export default {
    createContact,
    findDuplicate,
    searchContact,
    filterByType,
    deleteContact,
    findDuplicateEdit,
    updateContact
}