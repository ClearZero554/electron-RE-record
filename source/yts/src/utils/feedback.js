import { Notification, MessageBox, Message } from 'element-ui'

const notifyOption = {
    offset: 60,
    position: 'top-left'
}

class Feedback {
    static getInstance() {
        return this.instance ?? (this.instance = new Feedback())
    }

    // 成功消息
    msgSuccess(msg,option={}) {
        Message.success({ ...notifyOption, message: msg,...option })
    }

    // 警告消息
    msgWarning(msg,option={}) {
        Message.warning({ ...notifyOption, message: msg ,...option})
    }

    // 成功提示
    alertSuccess(msg) {
        MessageBox.alert(msg, '系统提示', { type: 'success' })
    }

    // 错误提示
    alertError(msg) {
        MessageBox.alert(msg, '系统提示', { type: 'error' })
    }

    // 通知提示
    notify(msg) {
        Notification.info({ ...notifyOption, title: msg })
    }

    // 成功通知
    notifySuccess(msg) {
        Notification.success({ ...notifyOption, title: msg })
    }

    // 警告通知
    notifyWarning(msg) {
        Notification.msgWarning({ ...notifyOption, title: msg })
    }

    // 错误通知
    notifyError(msg) {
        Notification.error({ ...notifyOption, title: msg })
    }
}

export default Feedback.getInstance()