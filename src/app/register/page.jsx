const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg(null);

  const payload = {
    action: 'register',
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company,
    taxId: form.taxId,
    address: form.address,
    role: form.role
  };

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      // เก็บสถานะลง LocalStorage สำรอง
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/workspace');
    } else {
      setErrorMsg(data.message || 'ไม่สามารถลงทะเบียนได้');
    }
  } catch (err) {
    // กรณีเน็ตเวิร์กหรือ API มีปัญหา ให้บันทึกลง LocalStorage และอนุญาตให้เข้าใช้งานได้
    const offlineUser = { ...payload, id: `offline-${Date.now()}`, isLoggedIn: true };
    localStorage.setItem('user', JSON.stringify(offlineUser));
    router.push('/workspace');
  } finally {
    setLoading(false);
  }
};