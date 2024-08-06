import { useState } from 'react'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { ContactInterface, Type, Option } from './interface/ContactInterface';
import ContactController from './controller/ContactController';
import { Dialog } from 'primereact/dialog';
import { contactSchema, ContactSchemaType } from './Schema/ContactSchema';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from 'primereact/inputmask';
import styles from "../src/assets/app.module.css"



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
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
    },
    {
      id: 5,
      name: "Eve Green",
      phone: "(51) 98765-4321",
      email: "eve.green@example.com",
      address: "654 Cedar St, Hilltop",
      note: "Precisa de suporte técnico",
      type: "Personal"
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
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<ContactInterface>({
    id: 5,
    name: "Eve Green",
    phone: "(51) 98765-4321",
    email: "eve.green@example.com",
    address: "654 Cedar St, Hilltop",
    note: "Precisa de suporte técnico",
    type: "Personal"
  });

  const { control, register, handleSubmit, formState: { errors } } = useForm<ContactInterface>({
    resolver: zodResolver(contactSchema)
  })
  const { reset: resetEdit, control: controlEdit, register: registerEdit, handleSubmit: handleEdit, formState: { errors: errorsEdit } } = useForm<ContactInterface>({
    resolver: zodResolver(contactSchema)
  })


  const handleEditClick = (contact: ContactInterface) => {
    setSelectedContact(contact);
    resetEdit(contact)
    setEditVisible(true);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newArray = ContactController.deleteContact(contacts, parseInt(e.currentTarget.value))
    setContacts(newArray)
    setShowingContacts(ContactController.searchContact(newArray, option, searchInput, filter))
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

  const handleCreateForm = (data: ContactSchemaType) => {
    if (ContactController.findDuplicate(contacts, data)) return alert('Contato já existe!')
    setContacts(ContactController.createContact(contacts, data))
    setShowingContacts(contacts)
  }


  const handleEditForm = (data: ContactSchemaType) => {
    if (ContactController.findDuplicateEdit(contacts, data, selectedContact?.id)) return alert('Contato já existe!')
    console.log(ContactController.updateContact(contacts, data, selectedContact.id))
  }

  const closeEditForm = () => {
    setEditVisible(false)
    resetEdit({
      name: "",
      phone: "",
      email: "",
      address: "",
      note: "",
      type: ""
    })

  }

  return (
    <div className={styles.container}>
      <section className={styles.container_create}>
        <h1>Criação de Contatos</h1>
        <form className={styles.form_container} autoComplete="off" onSubmit={handleSubmit(handleCreateForm)} >
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
        </form>

      </section>
      <section className={styles.container_search}>
        <h1>Busca</h1>
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
            <button onClick={handleSearch} type="submit">Buscar</button>
          </div>
          <div className={styles.filter}>
            <RadioButton id='todos' value={Type.All} onChange={handleFilter} checked={filter === Type.All} />
            <label htmlFor="todos">Todos</label>

            <RadioButton id='personal' value={Type.Personal} onChange={handleFilter} checked={filter === Type.Personal} />
            <label htmlFor="personal">Pessoal</label>

            <RadioButton id='professional' value={Type.Professional} onChange={handleFilter} checked={filter === Type.Professional} />
            <label htmlFor="professional">Profissional</label>
          </div>
        </form>


        <div className={styles.results_container}>
          {showingContacts.length ?
            showingContacts.map((item) => (
              <div key={item.id}>
                <p>{item.name}</p>
                <p>{item.phone}</p>
                <p>{item.type}</p>
                <button onClick={() => handleEditClick(item)}>Editar</button>
                <button value={item.id} onClick={handleDelete}>X</button><br />
              </div>
            )) : <p>Nenhum contato encontrado.</p>
          }

          {selectedContact && (
            <Dialog
              header={selectedContact.name}
              visible={editVisible}
              style={{ width: '200px', border: "2px solid #000", padding: "4px", backgroundColor: "#fff" }}
              onHide={closeEditForm}
            >
              <form autoComplete="off" onSubmit={handleEdit(handleEditForm)} >
                <div>
                  <input type="hidden" value={selectedContact.id} name='id' />
                  <div>
                    <div>
                      <label htmlFor="name">Name: <span>*</span></label>
                      <input defaultValue={selectedContact.name} type="text" {...registerEdit('name')} required id="name" placeholder="write your name correctly." />
                      {errorsEdit.name && <p >{errorsEdit.name.message}</p>}
                    </div>
                    <div >
                      <label htmlFor="phone">Phone: <span>*</span></label>
                      <Controller
                        name="phone"
                        control={controlEdit}
                        defaultValue={selectedContact.phone}
                        render={({ field }) => (
                          <InputMask

                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            mask="(99) 99999-9999"
                            placeholder="(99) 99999-9999"
                          />
                        )}
                      />
                      {errorsEdit.phone && <p >{errorsEdit.phone.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email">E-mail: <span className=" text-red-600">*</span></label>
                      <input defaultValue={selectedContact.email} type="email" {...registerEdit('email')} id="email" placeholder="write your email correctly." />
                      {errorsEdit.email && <p >{errorsEdit.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="address">Address: </label>
                      <input defaultValue={selectedContact.address} type="text" {...registerEdit('address')} id="address" placeholder="write your address correctly." />
                      {errorsEdit.address && <p >{errorsEdit.address.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="note">Note: </label>
                      <input defaultValue={selectedContact.note} type="text" {...registerEdit('note')} id="note" placeholder="write your note correctly." />
                      {errorsEdit.note && <p >{errorsEdit.note.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="note">Type: </label>
                      <select defaultValue={selectedContact.type} {...registerEdit('type')} name="type" id="type">
                        <option value="Personal">Personal</option>
                        <option value="Professional">Professional</option>
                      </select>
                      {errorsEdit.type && <p >{errorsEdit.type.message}</p>}
                    </div>
                  </div>
                  <div >
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </Dialog>
          )}
        </div>
      </section>


    </div>

  )
}

export default App
