import * as vscode from 'vscode';
import notifier from 'node-notifier';

export function activate(context: vscode.ExtensionContext) {
    const chat = (vscode as any).chat;
    if (!chat || !chat.createChatParticipant) {
        return;
    }

    const originalCreate = chat.createChatParticipant.bind(chat);
    chat.createChatParticipant = function(id: string, handler: any) {
        const wrappedHandler = async (request: any, context: any, response: any, token: vscode.CancellationToken) => {
            try {
                const result = await handler(request, context, response, token);
                notifier.notify({ title: 'GitHub Copilot', message: `Response from ${id} ready` });
                return result;
            } catch (err) {
                throw err;
            }
        };
        const participant = originalCreate(id, wrappedHandler);
        if (participant.onDidChangePauseState) {
            participant.onDidChangePauseState((e: any) => {
                if (e.isPaused) {
                    notifier.notify({ title: 'GitHub Copilot', message: `Action required for ${id}` });
                }
            });
        }
        return participant;
    };

    const copilotChat = vscode.extensions.getExtension('GitHub.copilot-chat');
    copilotChat?.activate();

    context.subscriptions.push({ dispose: () => { chat.createChatParticipant = originalCreate; } });
}

export function deactivate() {}
