import { useState, useEffect, useRef } from 'react'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { ContactInterface, Type, Option } from './interface/ContactInterface';
import ContactController from './controller/ContactController';
import { Dialog } from 'primereact/dialog';
import { contactSchema, ContactSchemaType } from './Schema/ContactSchema';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from 'primereact/inputmask';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import styles from "../src/assets/app.module.css"
import "primereact/resources/themes/lara-light-blue/theme.css"



function App() {
  const [contacts, setContacts] = useState<Array<ContactInterface>>([])

  const [showingContacts, setShowingContacts] = useState<Array<ContactInterface>>(contacts)
  const [searchInput, setSearchInput] = useState<string>("")
  const [option, setOption] = useState<string>(Option.Name)
  const [filter, setFilter] = useState<string>(Type.All)
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<ContactInterface>();
  const create_msgs = useRef<Messages>(null);
  const edit_msgs = useRef<Messages>(null);



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
    return create_msgs.current?.show(
      { sticky: false, life: 2000, severity: 'success', summary: '', detail: 'Contato excluído!', closable: false },
    );
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
    if (ContactController.findDuplicate(contacts, data)) return create_msgs.current?.show(
      { sticky: false, life: 2000, severity: 'warn', summary: '', detail: 'Contato já adicionado', closable: false },
    );
    setContacts(ContactController.createContact(contacts, data))
    setShowingContacts(contacts)
    return create_msgs.current?.show(
      { sticky: false, life: 2000, severity: 'success', summary: 'Sucesso', detail: 'Contato adicionado', closable: false },
    );
  }


  const handleEditForm = (data: ContactSchemaType) => {
    if (ContactController.findDuplicateEdit(contacts, data, selectedContact?.id)) return edit_msgs.current?.show(
      { sticky: false, life: 2000, severity: 'warn', summary: '', detail: 'Contato já adicionado', closable: false },
    );
    if (selectedContact) ContactController.updateContact(contacts, data, selectedContact.id)
    setEditVisible(false)
    return create_msgs.current?.show(
      { sticky: false, life: 2000, severity: 'success', summary: '', detail: 'Contato atualizado', closable: false },
    );


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
      <Messages style={{ position: "absolute", right: "30px", top: "10px" }} ref={create_msgs} />
      <section className={styles.container_create}>
        <h1>Criação de Contatos</h1>
        <form className={styles.form_container} autoComplete="off" onSubmit={handleSubmit(handleCreateForm)} >
          <div className={styles.form_body}>
            <div>
              <label htmlFor="name">Nome: <span>*</span></label>
              <input type="text" {...register('name')} required id="name" placeholder="Digite o nome do contato." />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>
            <div >
              <label htmlFor="phone">Telefone: <span>*</span></label>
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
              {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="email">E-mail: <span className=" text-red-600">*</span></label>
              <input type="email" {...register('email')} id="email" placeholder="Digite um email válido." />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="address">Endereço: </label>
              <input type="text" {...register('address')} id="address" placeholder="Digite um endereço." />
              {errors.address && <p className={styles.error}>{errors.address.message}</p>}
            </div>
            <div>
              <label htmlFor="note">Notas: </label>
              <input type="text" {...register('note')} id="note" placeholder="Digite uma anotação para o contato." />
              {errors.note && <p className={styles.error}>{errors.note.message}</p>}
            </div>
            <div>
              <label htmlFor="note">Tipo: </label>
              <select defaultValue={Type.Personal} {...register('type')} name="type" id="type">
                <option value={Type.Personal}>Pessoal</option>
                <option value={Type.Professional}>Profissional</option>
              </select>
              {errors.note && <p className={styles.error}>{errors.note.message}</p>}
            </div>
          </div>
          <div >
            <button type="submit">Adicionar Contato</button>
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
              <div className={styles.contact_card} key={item.id}>
                <p><strong>Nome: </strong> {item.name}</p>
                <p><strong>Telefone: </strong> {item.phone}</p>
                <p><strong>Tipo: </strong>{item.type}</p>
                <div>
                  <button className={styles.edit_button} onClick={() => handleEditClick(item)}>Editar</button>
                  <button className={styles.delete_button} value={item.id} onClick={handleDelete}>X</button>
                </div>
              </div>
            )) : <p>Nenhum contato encontrado.</p>
          }

          {selectedContact && (
            <Dialog
              header={selectedContact.name}
              visible={editVisible}
              className={styles.dialog_container}
              onHide={closeEditForm}
              resizable={false}
              draggable={false}
            >
              <form autoComplete="off" onSubmit={handleEdit(handleEditForm)} >
                <div>
                  <input type="hidden" value={selectedContact.id} name='id' />
                  <div className={styles.dialog_form_container}>
                    <div>
                      <label htmlFor="name">Name: <span>*</span></label>
                      <input defaultValue={selectedContact.name} type="text" {...registerEdit('name')} required id="name" placeholder="Digite o nome do contato." />
                      {errorsEdit.name && <p className={styles.error}>{errorsEdit.name.message}</p>}
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
                      {errorsEdit.phone && <p className={styles.error}>{errorsEdit.phone.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email">E-mail: <span className=" text-red-600">*</span></label>
                      <input defaultValue={selectedContact.email} type="email" {...registerEdit('email')} id="email" placeholder="Digite um email válido." />
                      {errorsEdit.email && <p className={styles.error}>{errorsEdit.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="address">Address: </label>
                      <input defaultValue={selectedContact.address} type="text" {...registerEdit('address')} id="address" placeholder="Digite um endereço." />
                      {errorsEdit.address && <p className={styles.error}>{errorsEdit.address.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="note">Note: </label>
                      <input defaultValue={selectedContact.note} type="text" {...registerEdit('note')} id="note" placeholder="Digite uma anotação para o contato." />
                      {errorsEdit.note && <p className={styles.error}>{errorsEdit.note.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="note">Type: </label>
                      <select defaultValue={selectedContact.type} {...registerEdit('type')} name="type" id="type">
                        <option value={Type.Personal}>Pessoal</option>
                        <option value={Type.Professional}>Profissional</option>
                      </select>
                      {errorsEdit.type && <p className={styles.error}>{errorsEdit.type.message}</p>}
                    </div>
                  </div>
                  <div >
                    <button className={styles.edit_button} type="submit">Salvar Alterações</button>
                  </div>
                </div>
              </form>
              <Messages style={{ position: "absolute", right: "100px", bottom: "-80px" }} ref={edit_msgs} />
            </Dialog>
          )}
        </div>
      </section>


    </div>

  )
}

export default App
