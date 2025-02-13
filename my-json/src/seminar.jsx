import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Необходимо для корректной работы react-modal

const SeminarsList = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSeminar, setCurrentSeminar] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/seminars")
      .then(response => {
        setSeminars(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Ошибка загрузки данных");
        setLoading(false);
      });
  }, []);

  // Функция удаления семинара
  const deleteSeminar = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот семинар?")) {
      try {
        await axios.delete(`http://localhost:3001/seminars/${id}`);
        setSeminars(seminars.filter(seminar => seminar.id !== id));
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  // Открыть модальное окно для редактирования
  const openEditModal = (seminar) => {
    setCurrentSeminar(seminar);
    setModalIsOpen(true);
  };

  // Закрыть модальное окно
  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentSeminar(null);
  };

  // Обновить данные в модальном окне
  const handleChange = (e) => {
    setCurrentSeminar({ ...currentSeminar, [e.target.name]: e.target.value });
  };

  // Сохранить изменения
  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:3001/seminars/${currentSeminar.id}`, currentSeminar);
      setSeminars(seminars.map(seminar => seminar.id === currentSeminar.id ? currentSeminar : seminar));
      closeModal();
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Список семинаров</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {seminars.map(seminar => (
          <div key={seminar.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", maxWidth: "300px" }}>
            <img src={seminar.photo} alt={seminar.title} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{seminar.title}</h3>
            <p>{seminar.description}</p>
            <p><strong>Дата:</strong> {seminar.date}</p>
            <p><strong>Время:</strong> {seminar.time}</p>
            <button 
              onClick={() => openEditModal(seminar)} 
              style={{
                backgroundColor: "blue", 
                color: "white", 
                border: "none", 
                padding: "8px", 
                cursor: "pointer",
                borderRadius: "4px",
                marginTop: "10px",
                marginRight: "10px"
              }}
            >
              Редактировать
            </button>
            <button 
              onClick={() => deleteSeminar(seminar.id)} 
              style={{
                backgroundColor: "red", 
                color: "white", 
                border: "none", 
                padding: "8px", 
                cursor: "pointer",
                borderRadius: "4px",
                marginTop: "10px"
              }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      {/* Модальное окно редактирования */}
      {currentSeminar && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              maxWidth: "400px",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px"
            }
          }}
        >
          <h2>Редактировать семинар</h2>
          <label>Название:</label>
          <input 
            type="text" 
            name="title" 
            value={currentSeminar.title} 
            onChange={handleChange} 
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <label>Описание:</label>
          <textarea 
            name="description" 
            value={currentSeminar.description} 
            onChange={handleChange} 
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <label>Дата:</label>
          <input 
            type="date" 
            name="date" 
            value={currentSeminar.date} 
            onChange={handleChange} 
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <label>Время:</label>
          <input 
            type="time" 
            name="time" 
            value={currentSeminar.time} 
            onChange={handleChange} 
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button 
            onClick={saveChanges} 
            style={{
              backgroundColor: "green", 
              color: "white", 
              border: "none", 
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              marginRight: "10px"
            }}
          >
            Сохранить
          </button>
          <button 
            onClick={closeModal} 
            style={{
              backgroundColor: "gray", 
              color: "white", 
              border: "none", 
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
          >
            Отмена
          </button>
        </Modal>
      )}
    </div>
  );
};

export default SeminarsList;

