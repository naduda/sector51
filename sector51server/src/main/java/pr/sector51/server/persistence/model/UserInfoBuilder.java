package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class UserInfoBuilder {
  private String login;
  private String password;
  private Timestamp created;
  private String name;
  private String surname;
  private String phone;
  private String email;
  private String roles;
  private String card;
  private boolean sex;

  public UserInfoBuilder setLogin(String login) {
    this.login = login;
    return this;
  }

  public UserInfoBuilder setPassword(String password) {
    this.password = password;
    return this;
  }

  public UserInfoBuilder setCreated(Timestamp created) {
    this.created = created;
    return this;
  }

  public UserInfoBuilder setName(String name) {
    this.name = name;
    return this;
  }

  public UserInfoBuilder setSurname(String surname) {
    this.surname = surname;
    return this;
  }

  public UserInfoBuilder setPhone(String phone) {
    this.phone = phone;
    return this;
  }

  public UserInfoBuilder setEmail(String email) {
    this.email = email;
    return this;
  }

  public UserInfoBuilder setRoles(String roles) {
    this.roles = roles;
    return this;
  }

  public UserInfoBuilder setCard(String card) {
    this.card = card;
    return this;
  }

  public UserInfoBuilder setCSex(boolean sex) {
    this.sex = sex;
    return this;
  }

  public UserInfo build() {
    return new UserInfo(login, password, created, name, surname, phone, email, roles, card, sex);
  }
}