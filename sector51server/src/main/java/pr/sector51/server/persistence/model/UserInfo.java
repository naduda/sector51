package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class UserInfo {
  private Timestamp created;
  private String name;
  private String surname;
  private String phone;
  private String email;
  private String roles;
  private String card;
  private int balance;
  private boolean sex;
  private  String password;

  public UserInfo() {}

  public UserInfo(String password, Timestamp id, String name, String surname,
      String phone, String email, String roles, String card, int balance, boolean sex) {
    this();
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.roles = roles;
    this.card = card;
    this.balance = balance;
    this.created = id;
    this.sex = sex;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Timestamp getCreated() {
    return created;
  }

  public void setCreated(Timestamp created) {
    this.created = created;
  }

  public String getName() {
    return name;
  }

  public String getSurname() {
    return surname;
  }

  public String getPhone() {
    return phone;
  }

  public String getEmail() {
    return email;
  }

  public String getRoles() {
    return roles;
  }

  public void setRoles(String roles) {
    this.roles = roles;
  }

  public String getCard() {
    return card;
  }

  public int getBalance() {
    return balance;
  }

  public void setBalance(int balance) {
    this.balance = balance;
  }

  public boolean isSex() {
    return sex;
  }
}
