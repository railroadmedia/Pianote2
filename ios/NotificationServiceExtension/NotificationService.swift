import UserNotifications
class NotificationService: UNNotificationServiceExtension {
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    func failEarly() {
      contentHandler(request.content)
    }
    
    guard let content = (request.content.mutableCopy() as? UNMutableNotificationContent) else {
      return failEarly()
    }
    
    guard let attachmentURL = content.userInfo["image"] as? String else {
      return failEarly()
    }
    
    guard let imageData = NSData(contentsOf:NSURL(string: attachmentURL)! as URL) else { return failEarly() }
    guard let attachment = UNNotificationAttachment.create(imageFileIdentifier: "image.gif", data: imageData, options: nil) else { return failEarly() }
    
    content.attachments = [attachment]
    content.sound = UNNotificationSound.default

    contentHandler(content)
  }
  
  override func serviceExtensionTimeWillExpire() {
    if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
}

extension UNNotificationAttachment {
  static func create(imageFileIdentifier: String, data: NSData, options: [NSObject : AnyObject]?) -> UNNotificationAttachment? {
    
    let fileManager = FileManager.default
    let tmpSubFolderName = ProcessInfo.processInfo.globallyUniqueString
    let fileURLPath      = NSURL(fileURLWithPath: NSTemporaryDirectory())
    let tmpSubFolderURL  = fileURLPath.appendingPathComponent(tmpSubFolderName, isDirectory: true)
    
    do {
      try fileManager.createDirectory(at: tmpSubFolderURL!, withIntermediateDirectories: true, attributes: nil)
      let fileURL = tmpSubFolderURL?.appendingPathComponent(imageFileIdentifier)
      try data.write(to: fileURL!, options: [])
      let imageAttachment = try UNNotificationAttachment.init(identifier: imageFileIdentifier, url: fileURL!, options: options)
      return imageAttachment
    } catch let error {
      print("error \(error)")
    }
    
    return nil
  }
}
