// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCu5JyCL5LbTpvm5c2YDFOzBiNDIq_zUq4",
  authDomain: "pathfinder-1d5df.firebaseapp.com"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Wait for navbar to load before attaching events
document.addEventListener('navbarLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const signupModal = document.getElementById('signupModal');
  const closeSignup = document.getElementById('closeSignup');

  // Show/Hide Login Modal
  loginBtn.onclick = () => loginModal.style.display = 'flex';
  closeModal.onclick = () => loginModal.style.display = 'none';

  // Show/Hide Signup Modal
  document.getElementById('openSignup')?.addEventListener('click', () => {
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
  });
  closeSignup.onclick = () => signupModal.style.display = 'none';

  // Email login
  document.getElementById('emailLoginBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    try {
      await auth.setPersistence(
        remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
      );
      await auth.signInWithEmailAndPassword(email, password);
      loginModal.style.display = 'none';
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert("No account found. Please sign up first.");
      } else {
        alert(error.message);
      }
    }
  });

  // Email signup
  document.getElementById('signupBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Account created successfully!");
      signupModal.style.display = 'none';
    } catch (error) {
      alert(error.message);
    }
  });

  // Google login
  document.getElementById('googleLoginBtn').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      loginModal.style.display = 'none';
    } catch (error) {
      alert(error.message);
    }
  });

  // Auth state change
  auth.onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('loginBtn');
    const profileMenu = document.getElementById('profileMenu');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    if (user) {
      loginBtn.style.display = 'none';
      profileMenu.style.display = 'block';
      userEmailDisplay.textContent = user.email;
    } else {
      loginBtn.style.display = 'block';
      profileMenu.style.display = 'none';
    }
  });

  // Profile dropdown toggle
  const profileIcon = document.getElementById('profileIcon');
  const dropdownMenu = document.getElementById('dropdownMenu');
  profileIcon.addEventListener('click', () => {
    dropdownMenu.style.display =
      dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
  });
});

// Career roadmap toggle
document.querySelectorAll('.career-item').forEach(item => {
  item.addEventListener('click', () => {
    const roadmapId = item.getAttribute('data-roadmap');
    const roadmap = document.getElementById(roadmapId);
    roadmap.classList.toggle('hidden');
  });
});
