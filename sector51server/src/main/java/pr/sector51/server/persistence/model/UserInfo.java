package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class UserInfo {

  private String login;
  private Timestamp created;
  private String name;
  private String surname;
  private String phone;
  private String email;
  private String roles;
  private String card;

  public UserInfo(String login, Timestamp id, String name, String surname,
      String phone, String email, String card, String roles) {
    this.login = login;
    this.created = id;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.roles = roles;
    this.card = card;
  }

  public String getLogin() {
    return login;
  }

  public Timestamp getCreated() {
    return created;
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

  public String getCard() {
    return card;
  }
}
