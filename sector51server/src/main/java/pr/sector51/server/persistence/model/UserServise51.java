package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class UserServise51 {
  private int idService;
  private String desc;
  private Timestamp idUser;
  private Timestamp dtBeg;
  private Timestamp dtEnd;
  private String value;

  public UserServise51() {}

  public UserServise51(int idService, Timestamp idUser, Timestamp dtBeg, Timestamp dtEnd, String value) {
    this();
    this.idService = idService;
    this.idUser = idUser;
    this.dtBeg = dtBeg;
    this.dtEnd = dtEnd;
    this.value = value;
  }

  public int getIdService() {
    return idService;
  }

  public void setIdService(int idService) {
    this.idService = idService;
  }

  public String getDesc() {
    return desc;
  }

  public void setDesc(String desc) {
    this.desc = desc;
  }

  public Timestamp getIdUser() {
    return idUser;
  }

  public void setIdUser(Timestamp idUser) {
    this.idUser = idUser;
  }

  public Timestamp getDtBeg() {
    return dtBeg;
  }

  public void setDtBeg(Timestamp dtBeg) {
    this.dtBeg = dtBeg;
  }

  public Timestamp getDtEnd() {
    return dtEnd;
  }

  public void setDtEnd(Timestamp dtEnd) {
    this.dtEnd = dtEnd;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
}
