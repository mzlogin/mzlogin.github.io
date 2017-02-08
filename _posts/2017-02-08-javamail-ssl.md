---
layout: post
title: template page
categories: Java
description: 通过JavaMail发送邮件的简单实现
keywords: JavaMail, SSL, 腾讯企业邮箱
---
今天遇到了一个要做站内邮件通知系统的需求，写一篇文档来记录遇到的问题，和解决方案。
<p>1.如果是maven项目，需要引入依赖包：</p>

<pre>
  <code>&lt;dependency&gt;  
    &lt;groupId&gt;javax.mail&lt;/groupId&gt;  
    &lt;artifactId&gt;mail&lt;/artifactId&gt;
    &lt;version&gt;1.4.4&lt;/version&gt;  
&lt;/dependency&gt;</code>
</pre>

<p>2.如果jre环境是1.8，需要替换[jce](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html)</p>

* JCE 即 Java 加密扩展（JCE, Java Cryptography Extension），是一组提供加密、密钥生成、密码协议和消息认证码（MAC, Message Authentication Code）算法的框架和接口包，支持包括对称密码、不对称密码、分组密码、流密码。该软件还支持安全流和密封对象。

* Java8影响邮件发送解决办法：
对应我的 Java 8 的版本，下载 JCE ，解压并将其中的两个 jar 包：local_policy.jar ，US_export_policy.jar 复制到 %JAVA_HOME%\jre\lib\security 即可。

<p>3.下面放一下通过JavaMail发送邮件的代码：</p>
* 首先写一个配置文件来存储邮箱信息email.properties
<pre>
  <code>mail.from=邮箱用户名
mail.host=邮箱对应的smtp host，例如企业qq的smtp.exmail.qq.com
mail.account=邮箱用户名
mail.password=邮箱密码
mail.smtp.auth=true
mail.smtp.timeout=25000
mail.port=465
mail.ssl=true
mail.protocol=smtp</code>
</pre>

* SendEmailUtils.java
<pre>
  <code>import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.util.Date;
import java.util.Properties;

  import javax.mail.Authenticator;
  import javax.mail.Message;
  import javax.mail.MessagingException;
  import javax.mail.PasswordAuthentication;
  import javax.mail.Session;
  import javax.mail.Transport;
  import javax.mail.internet.InternetAddress;
  import javax.mail.internet.MimeMessage;

  import com.sun.mail.util.MailSSLSocketFactory;

  public class SendEmailUtils {

    private static String account;     //登录用户名
    private static String pass;        //登录密码
    private static String from;        //发件地址
    private static String host;        //服务器地址
    private static String port;        //端口
    private static String protocol;    //协议

    static{
        Properties prop = new Properties();
        InputStream instream = ClassLoader.getSystemResourceAsStream("email.properties");
        try {
            prop.load(instream);
        } catch (IOException e) {
            System.out.println("加载属性文件失败");
        }
        account = prop.getProperty("e.account");
        pass = prop.getProperty("e.pass");
        from = prop.getProperty("e.from");
        host = prop.getProperty("e.host");
        port = prop.getProperty("e.port");
        protocol = prop.getProperty("e.protocol");
    }
    //用户名密码验证，需要实现抽象类Authenticator的抽象方法PasswordAuthentication
    static class MyAuthenricator extends Authenticator{  
        String u = null;  
        String p = null;  
        public MyAuthenricator(String u,String p){  
            this.u=u;  
            this.p=p;  
        }  
        @Override  
        protected PasswordAuthentication getPasswordAuthentication() {  
            return new PasswordAuthentication(u,p);  
        }  
    }

    private String to;    //收件人

    public SendEmailUtils(String to) {
        this.to = to;
    }

    public void send(){
        Properties prop = new Properties();
        //协议
        prop.setProperty("mail.transport.protocol", protocol);
        //服务器
        prop.setProperty("mail.smtp.host", host);
        //端口
        prop.setProperty("mail.smtp.port", port);
        //使用smtp身份验证
        prop.setProperty("mail.smtp.auth", "true");
        //使用SSL，企业邮箱必需！
        //开启安全协议
        MailSSLSocketFactory sf = null;
        try {
            sf = new MailSSLSocketFactory();
            sf.setTrustAllHosts(true);
        } catch (GeneralSecurityException e1) {
            e1.printStackTrace();
        }
        prop.put("mail.smtp.ssl.enable", "true");
        prop.put("mail.smtp.ssl.socketFactory", sf);
        Session session = Session.getDefaultInstance(prop, new MyAuthenricator(account, pass));
        session.setDebug(true);
        MimeMessage mimeMessage = new MimeMessage(session);
        try {
            mimeMessage.setFrom(new InternetAddress(from,"发送人"));
            mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            mimeMessage.setSubject("标题");
            mimeMessage.setSentDate(new Date());
            mimeMessage.setText("内容");
            mimeMessage.saveChanges();
            Transport.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}</pre>

<p>3.要频繁使用的时候不要是使用Transport的静态方法</p>
* 应该这样使用：
<pre><code>
  Properties props = new Properties();  
  props.setProperty("mail.smtp.auth", "true");  
  props.setProperty("mail.transport.protocol", "smtp");//没写的时候  javax.mail.NoSuchProviderException: Invalid protocol: null  
  Session session = Session.getInstance(props);  
  session.setDebug(true);  

  //创建message对象  
  Message msg = new MimeMessage(session);  
  msg.setText("你好吗？");  
  msg.setFrom(new InternetAddress("zhangsan@163.com"));  
  Transport transport = session.getTransport();  
  transport.connect("smtp.163.com",25, "zhangsan", "123456");  
  transport.sendMessage(msg,new Address[]{new InternetAddress("lisi@sina.com")});  
  //transport.send(msg,new Address[]{new InternetAddress("lisi@sina.com")});  
  transport.close();  </code></pre>
