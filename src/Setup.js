import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './App.css';
import NavigationBar from './NavigationBar';
import {DiscordWebhookClient} from './disbox-file-manager';

function Setup() {
    const navigate = useNavigate();

    const onContinue = (event) => {
        event.preventDefault();
        localStorage.setItem("loginKey", document.querySelector("#login").value);
        navigate("/");
    };
    const onRegister = async (event) => {
        event.preventDefault();
        const webhookUrl = document.getElementById("webhookUrl").value;
        const keybox = document.querySelector("[name=\"login_key_preview\"]");
        let webhookPath = "";
        try {
            webhookPath = (new URL(webhookUrl)).pathname;
        } catch {}
        const webhookParts = /^\/api\/webhooks\/(?<webhook_id>.+?)\/(?<webhook_token>.+?)$/.exec(webhookPath)?.groups;
        if (!webhookParts) {
            keybox.value = "Please check your webhook and try again."
        }
        const wh = new DiscordWebhookClient(webhookParts.webhook_id, webhookParts.webhook_token);
        try {
            const root = await wh.sendAttachment("i.png", new Blob([JSON.stringify({children: {}})], {type: "application/json"}));
            keybox.value = `${webhookParts.webhook_id}/${webhookParts.webhook_token}/${root.id}`;
        } catch(e) {
            keybox.value = "Please check your webhook and try again.";
            console.error(e);
        }
    }
    return (<div>
        <NavigationBar />
        <div className="App App-header" style={{ color: "black" }}>
            <div style={{ backgroundColor: "#FCFCFC", width: "66%", height: "90vh" }}>
                <h1 style={{ fontSize: "6rem" }} className='mt-3' >
                    <b>Setup</b>
                </h1>
                <h1 style={{ fontSize: "2rem" }}>
                    <b>Just a few steps and we're ready to go.</b>
                </h1>
                <div style={{ fontSize: "1.5rem", textAlign: "left", width: "80%", margin: "2rem" }} className="mt-4">
                    <b style={{ color: "#555555" }}>1.</b> Open a <a href="https://discord.com/app" target="_blank" rel="noopener noreferrer">Discord</a> account, if you don't already have one.
                    <div style={{ height: "1rem" }} />
                    <b style={{ color: "#555555" }}>2.</b> Open a new server.
                    Don't share this server with anyone, as it will be used to store your files.
                    <div style={{ height: "1rem" }} />
                    <b style={{ color: "#555555" }}>3.</b> Open <b>Server Settings</b> from the top left menu, select <b>Integrations</b> and click <b>Create Webhook</b>.
                    <div style={{ height: "1rem" }} />
                    <b style={{ color: "#555555" }}>4.</b> Copy the URL of the webhook you just created by clicking on the <b>Copy Webhook URL</b> button.
                    <div style={{ height: "1rem" }} />
                    This URL will be used as your password for the Disbox client and it provides full access to all your files, so don't share it with anyone or store it anywhere.
                    You can always access this URL from the Integrations menu again, if you forget it.
                    <div style={{ height: "1rem" }} />
                    <b style={{ color: "#555555" }}>5.</b> Paste your URL here:
                </div>
                <Form onSubmit={onRegister}>
                    <Form.Group>
                        <Form.Control id="webhookUrl" type="text" placeholder="Webhook URL" style={{ width: "80%", margin: "auto", fontSize: "2rem" }} />
                    </Form.Group>
                    <Button type="submit" variant="primary" style={{ width: "80%", margin: "auto", marginTop: "1rem", fontSize: "2rem" }}><b>Create</b></Button>
                </Form>
                <br />
                This will show your login key: <input type="text" name="login_key_preview" placeholder="XXXXXX/XXXXXXX/XXXXXXX" disabled />
                <br />
                <br />
                <Form onSubmit={onContinue}>
                    <Form.Group>
                        <Form.Control id="login" type="password" placeholder="Login to an existing account with login key" style={{ width: "80%", margin: "auto", fontSize: "2rem" }} />
                    </Form.Group>
                    <Button type="submit" variant="primary" style={{ width: "80%", margin: "auto", marginTop: "1rem", fontSize: "2rem" }}><b>Continue</b></Button>
                </Form>
                <br />
                <br />
            </div>
        </div>
    </div>

    );
}

export default Setup;
