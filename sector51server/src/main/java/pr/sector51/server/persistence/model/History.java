package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class History {
  private int id;
  private int idEvent;
  private Timestamp idUser;
  private Timestamp time;
  private String desc;

  public History() {}

  public History(int idEvent, Timestamp idUser, String desc) {
    super();
    this.idEvent = idEvent;
    this.idUser = idUser;
    this.desc = desc;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public int getIdEvent() {
    return idEvent;
  }

  public void setIdEvent(int idEvent) {
    this.idEvent = idEvent;
  }

  public Timestamp getIdUser() {
    return idUser;
  }

  public void setIdUser(Timestamp idUser) {
    this.idUser = idUser;
  }

  public Timestamp getTime() {
    return time;
  }

  public void setTime(Timestamp time) {
    this.time = time;
  }

  public String getDesc() {
    return desc;
  }

  public void setDesc(String desc) {
    this.desc = desc;
  }
}
