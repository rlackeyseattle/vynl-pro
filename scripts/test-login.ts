async function testLogin() {
    const res = await fetch("http://localhost:3000/api/auth/callback/credentials", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "email=rlackey.seattle@gmail.com&password=072425ChlWal!&redirect=false&csrfToken=test",
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
}
testLogin();
