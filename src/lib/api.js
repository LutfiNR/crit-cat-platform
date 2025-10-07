export const validateAccessCode = async (accessCode) => {
  const response = await fetch('/api/validate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Gagal validasi kode.');
  return data;
};

export const getTestQuestions = async () => {
  const response = await fetch('/api/questions');
  if (!response.ok) throw new Error('Gagal mengambil data soal.');
  const data = await response.json();
  return data.questions;
};

/**
 * Mengambil detail satu soal berdasarkan ID.
 * @param {string} id - ID dari soal.
 * @returns {Promise<object>} Data soal.
 */
export const getQuestionById = async (id) => {
  const response = await fetch(`/api/questions/${id}`);
  if (!response.ok) {
    throw new Error('Gagal mengambil detail soal.');
  }
  const data = await response.json();
  return data.data;
};

/**
 * Memperbarui data soal yang sudah ada.
 * @param {string} id - ID dari soal yang akan diupdate.
 * @param {object} questionData - Data baru untuk soal.
 * @returns {Promise<object>} Data soal yang sudah diperbarui.
 */
export const updateQuestion = async (id, questionData) => {
  const response = await fetch(`/api/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questionData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal memperbarui soal.');
  }
  return data;
};

/**
 * Menghapus soal berdasarkan ID.
 * @param {string} id - ID dari soal yang akan dihapus.
 * @returns {Promise<object>} Pesan sukses.
 */
export const deleteQuestion = async (id) => {
  const response = await fetch(`/api/questions/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal menghapus soal.');
  }
  return data;
};

export const postTestQuestions = async (questions) => {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questions),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Gagal menyimpan soal.');
  return data;
};

export const submitTestResults = async (submissionData) => {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Gagal menyimpan hasil tes.');
  return data;
};

/**
 * Mengambil data ringkasan rekap tes untuk guru.
 * @returns {Promise<Array<object>>} Daftar tes beserta jumlah pengerjaan.
 */
export const getTestRecapSummary = async () => {
  const response = await fetch('/api/recap/tests');
  if (!response.ok) {
    throw new Error('Gagal mengambil data rekap.');
  }
  const data = await response.json();
  return data.data;
};

/**
 * Mengambil data rekap detail untuk satu tes spesifik.
 * @param {string} testId - ID dari tes.
 * @returns {Promise<object>} Detail tes beserta daftar hasil pengerjaan siswa.
 */
export const getTestRecapDetail = async (testId) => {
  const response = await fetch(`/api/recap/tests/${testId}`);
  if (!response.ok) {
    throw new Error('Gagal mengambil detail rekap tes.');
  }
  const data = await response.json();
  return data.data;
};