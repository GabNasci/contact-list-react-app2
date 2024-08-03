import { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from 'primereact/inputmask';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { z } from "zod"
import { ContactInterface, Type, Option } from './interface/ContactInterface';
import ContactController from './controller/ContactController';


const phoneRegex: RegExp = /^\(\d{2}\) \d{5}-\d{4}$/

const contactSchema = z.object({
  name: z.string(),
  phone: z.string().regex(phoneRegex, { message: "must be (XX)XXXXX-XXXX" }),
  email: z.string().email(),
  address: z.string(),
  note: z.string(),
  type: z.string()
})

export type ContactSchemaType = z.infer<typeof contactSchema>

function App() {
  const [contacts, setContacts] = useState<Array<ContactInterface>>([
    {
      id: 1,
      name: "Alice Johnson",
      phone: "(11) 98765-4321",
      email: "alice.johnson@example.com",
      address: "123 Main St, Springfield",
      note: "Cliente regular",
      type: "Personal"
    },
    {
      id: 2,
      name: "Bob Smith",
      phone: "(21) 92345-6789",
      email: "bob.smith@example.com",
      address: "456 Elm St, Rivertown",
      note: "Contato de negócios",
      type: "Professional"
    },
    {
      id: 3,
      name: "Carol White",
      phone: "(31) 99876-5432",
      email: "carol.white@example.com",
      address: "789 Oak St, Mountainview",
      note: "Prefere comunicação via e-mail",
      type: "Personal"
    },
    {
      id: 4,
      name: "David Brown",
      phone: "(41) 91234-5678",
      email: "david.brown@example.com",
      address: "321 Pine St, Lakeside",
      note: "Disponível apenas à tarde",
      type: "Professional"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    }
  ])
  const [showingContacts, setShowingContacts] = useState<Array<ContactInterface>>(contacts)
  const [searchInput, setSearchInput] = useState<string>("")
  const [option, setOption] = useState<string>(Option.Name)
  const [filter, setFilter] = useState<string>(Type.All)


  const { control, register, handleSubmit, formState: { errors } } = useForm<ContactInterface>({
    resolver: zodResolver(contactSchema)
  })

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const updatedContacts = ContactController.deleteContact(contacts, e.button.valueOf());
    setContacts(updatedContacts);
    const updatedShowingContacts = ContactController.searchContact(updatedContacts, option, searchInput, filter);
    setShowingContacts(updatedShowingContacts);
    console.log(contacts)
    
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value)
  }

  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)

  }

  const handleFilter = (e: RadioButtonChangeEvent) => {
    setFilter(e.target.value)
    setShowingContacts(ContactController.searchContact(contacts, option, searchInput, e.target.value))
  }

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(filter)
    setShowingContacts(ContactController.searchContact(contacts, option, searchInput, filter))
  }

  const handleForm = (data: ContactSchemaType) => {
    if (ContactController.findDuplicate(contacts, data)) return alert('Contato já existe!')
    ContactController.createContact(contacts, data)
    setShowingContacts(contacts)
    console.log(contacts)
  }

  // const handleDelete = (id: number) => {
  //   // Remove o contato da lista de contatos
  //   const updatedContacts = ContactController.deleteContact(contacts, id);
  //   setContacts(updatedContacts); // Atualiza o estado de contatos
  
  //   // Atualiza a lista de contatos mostrados
  //   setShowingContacts(
  //     ContactController.searchContact(updatedContacts, option, searchInput, filter)
  //   );
  // };


  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit(handleForm)} >
        <div>
          <h1>Criação de Contato</h1>
        </div>
        <div>
          <div>
            <div>
              <label htmlFor="name">Name: <span>*</span></label>
              <input type="text" {...register('name')} required id="name" placeholder="write your name correctly." />
              {errors.name && <p >{errors.name.message}</p>}
            </div>
            <div >
              <label htmlFor="phone">Phone: <span>*</span></label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputMask
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    mask="(99) 99999-9999"
                    placeholder="(99) 99999-9999"
                  />
                )}
              />
              {errors.phone && <p >{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="email">E-mail: <span className=" text-red-600">*</span></label>
              <input type="email" {...register('email')} id="email" placeholder="write your email correctly." />
              {errors.email && <p >{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="address">Address: </label>
              <input type="text" {...register('address')} id="address" placeholder="write your address correctly." />
              {errors.address && <p >{errors.address.message}</p>}
            </div>
            <div>
              <label htmlFor="note">Note: </label>
              <input type="text" {...register('note')} id="note" placeholder="write your note correctly." />
              {errors.note && <p >{errors.note.message}</p>}
            </div>
            <div>
              <label htmlFor="note">Type: </label>
              <select defaultValue={"Personal"} {...register('type')} name="type" id="type">
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
              </select>
              {errors.note && <p >{errors.note.message}</p>}
            </div>
          </div>
          <div >
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
      <div>
        <h1>Lista de Contatos</h1>
      </div>
      <form >
        <div >
          <label htmlFor="option">Buscar por:</label>
          <select onChange={handleSelect} value={option} name="option" id="option">
            <option value={Option.Name}>Nome</option>
            <option value={Option.Email}>Email</option>
            <option value={Option.Phone}>Telefone</option>
          </select>
        </div>
        <div >
          <input value={searchInput} onChange={handleInputSearch} type="search" name="search" id="search" placeholder="Busque aqui" />
        </div>
        <div>
          <button onClick={handleSearch} type="submit">Buscar</button>
        </div>
      </form>
      <div style={{ display: "flex", gap: "4px" }}>
          <RadioButton id='todos' value={Type.All} onChange={handleFilter} checked={filter === Type.All} />
          <label htmlFor="todos">Todos</label>

          <RadioButton id='personal' value={Type.Personal} onChange={handleFilter} checked={filter === Type.Personal} />
          <label htmlFor="personal">Pessoal</label>

          <RadioButton id='professional' value={Type.Professional} onChange={handleFilter} checked={filter === Type.Professional} />
          <label htmlFor="professional">Profissional</label>
        </div>

      <div>
        {showingContacts.length ?
          showingContacts.map((item, key) => (
            <div key={key}><br />{item.name}, {item.type}, {item.phone}, {item.email} <button value={key} onClick={handleDelete}>X</button><br /></div>
          )) : <p>Nenhum contato encontrado.</p>
        }
      </div>
    </div>

  )
}

export default App
