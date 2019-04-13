export default {

  assets: {
    cast_in: 'Cast in',
    delete_error: 'An error occured while deleting this asset. There are probably data linked to it. Are you sure this asset type has no task linked to it?',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    edit_fail: 'Creation or edition failed, an error occured.',
    edit_success: 'Asset {name} successfully edited.',
    edit_title: 'Edit asset',
    empty_list: 'There is no asset in the production. What about creating some?',
    empty_list_client: 'There is no asset in this production.',
    new_asset: 'Add an asset',
    new_assets: 'Add assets',
    new_success: 'Asset {name} successfully created.',
    no_cast_in: 'This asset is not cast in any shot.',
    number: 'Asset | Assets',
    restore_text: 'Are you sure you want to restore {name} into your database?',
    restore_error: 'An error occured while restoring this asset.',
    tasks: 'Asset tasks',
    title: 'Assets',
    fields: {
      description: 'Beschreibung',
      episode: 'Ep.',
      name: 'Name',
      production: 'Prod',
      type: 'Typ',
      time_spent: 'Arbeitszeit',
      due_date: 'Enddatum'
    }
  },

  asset_types: {
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this asset type. There are probably data linked to it. Are you sure this asset type has no asset linked to it?',
    edit_title: 'Asset Typ bearbeiten',
    new_asset_type: 'Asset Typ hinzufügen',
    number: 'Asset Typ | Asset Typen',
    title: 'Asset Typen',
    production_title: 'Asset Types Stats',
    fields: {
      name: 'Name'
    }
  },

  breakdown: {
    all_assets: 'Verfügbare Assets',
    select_shot: 'Shot auswählen, um Assets zuzuweisen',
    selected_shot: 'Assets in {sequence_name} / {name}',
    save_error: 'An error occured while saving breakdown.',
    title: 'Breakdown'
  },

  comments: {
    add_comment: 'Kommentar hinzufügen...',
    add_preview: 'Preview anhängen',
    change_preview: 'Preview verändern',
    empty_text: 'Leerer Kommentar',
    edit_title: 'Kommentar bearbeiten',
    error: 'Fehler beim Posten des Kommentars',
    no_file_attached: 'Kein Dateianhang',
    post_status: 'Speichern',
    retake: 'Retake',
    validated: 'Abgenommen',
    validation_required: 'Abnahme steht aus',
    set_status_to: 'Status ändern',
    fields: {
      text: 'text'
    }
  },

  custom_actions: {
    delete_text: 'Are you sure you want to remove custom action {name} from your database?',
    delete_error: 'An error occured while deleting this custom custom action.',
    edit_title: 'Edit a custom action',
    new_custom_action: 'Add a custom action',
    number: 'custom action | custom actions',
    run_for_selection: 'Run custom action for selected tasks:',
    title: 'Custom Actions',
    fields: {
      name: 'Name',
      url: 'URL',
      entity_type: 'Entity Type'
    },
    entity_types: {
      all: 'All',
      shot: 'Shot',
      asset: 'Asset'
    }
  },

  episodes: {
    delete_error: 'An error occured while deleting this episode. There are probably data linked to it. Are you sure this episode has no sequence linked to it?',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    edit_title: 'Edit episode',
    empty_list: 'There is no episode in the production. What about creating some?',
    empty_list_client: 'There is no episode in this production.',
    new_episode: 'New episode',
    number: 'episode | episodes',
    title: 'Episodes',
    fields: {
      name: 'name',
      description: 'Beschreibung'
    }
  },

  login: {
    forgot_password: 'Forgot password?',
    login: 'Log in',
    login_failed: 'Log in failed, please verify your credentials',
    login_page: 'Cancel',
    reset_change_password: 'Change password',
    reset_change_password_form_failed: 'There is a problem with the password you gave. Please, verify that it is more than 6 chars long and that both passwords match.',
    reset_change_password_failed: 'Changing password failed. Please, restart the whole procedure again.',
    reset_change_password_succeed: 'Your password was changed successfully. Please, go back to the login page to use it.',
    reset_change_password_title: 'Enter a new password',
    reset_password: 'Reset Password',
    reset_password_failed: 'Reset Password failed. Please verify your email.',
    reset_password_succeed: 'Reset Password succeeded. Please check your inbox.',
    reset_password_title: 'Enter your email to reset your password',
    title: 'Log in to Intranet 2.0',
    fields: {
      email: 'Email',
      password: 'Password',
      password2: 'Password again'
    }
  },

  main: {
    add: 'Hinzufügen',
    all: 'Alle',
    admin: 'Admin',
    cancel: 'Abbrechen',
    clear_selection: 'Auswahl aufheben',
    count: 'Anzahl',
    documentation: 'Dokumentation',
    close: 'Schließen',
    confirmation: 'Bestätigen',
    confirmation_and_stay: 'Bestätigen und bleiben',
    dark_theme: 'Dunkles UI',
    days_spent: 'Tage',
    delete: 'Löschen',
    delete_all: 'Alle löschen',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    edit: 'Bearbeiten',
    empty_comment: 'Leerer Kommentar',
    history: 'Verlauf',
    info: 'Information',
    or: 'oder',
    no: 'Nein',
    loading_data: 'Lade Daten',
    loading_error: 'Fehler beim Laden der Daten',
    logout: 'Ausloggen',
    modify: 'Bearbeiten',
    minimize: 'Minimieren',
    maximize: 'Maximieren',
    nb_frames: 'Frames',
    profile: 'Profil',
    production: 'Produktion',
    remove: 'Entfernen',
    save: 'Speichern',
    sorted_by: 'Tasks sortiert nach:',
    studio: 'Studio',
    user: 'Nutzer',
    white_theme: 'Helles UI',
    yes: 'Ja',
    csv: {
      export_file: 'Export',
      error_upload: 'An error occured while uploading your CSV file.',
      import_file: 'Import',
      import_title: 'Import data from a CSV file',
      required_fields: 'Your CSV file requires the following columns',
      select_file: 'Please select a file from one of your folder:'
    },
    xml: {
      export_file: 'Export',
      error_upload: 'An error occured while uploading your XML file.',
      import_file: 'Import',
      import_title: 'Import data from a XML file',
      select_file: 'Please select a file from one of your folder:'
    }
  },

  menu: {
    assign_tasks: 'Tasks zuweisen',
    change_priority: 'Priorität ändern',
    change_status: 'Status ändern',
    create_tasks: 'Tasks erstellen',
    delete_tasks: 'Tasks löschen',
    run_custom_action: 'Run custom action',
    change_due_date: 'Enddatum festlegen',
    set_estimations: 'Einschätzung festlegen'
  },

  not_found: {
    text: 'There was something wrong with the link you clicked on, we encourage you to come back on the home page.',
    title: 'Page not found... are your looking for something you deleted?'
  },

  notifications: {
    and_change_status: 'and changed status to',
    commented_on: 'commented on',
    no_notifications: 'keine Nachrichten',
    title: 'Meine Nachrichten',
    with_preview: 'with a preview'
  },

  contacts: {
    update_sevdesk: 'Update Sevdesk',
    update_error: 'Falsches Token',
    delete_error: 'Fehler beim Löschen',
    title: 'Kontakte',
    new_contact: 'Kontakt hinzufügen',
    new_person: 'Neuer Kontakt',
    persons: 'Kontakt | Kontakte',
    fields: {
      first_name: 'Vorname',
      last_name: 'Nachname',
      company: 'Firma',
      address: 'Address',
      email: 'E-Mail',
      phone: 'Telefon',
      mobile: 'Mobil',
      role: 'Typ'
    },
    list: {
      first_name: 'Vorname',
      last_name: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      role: 'Typ',
      company: 'Firma',
      address: 'Adresse',
      mobile: 'Mobil'
    },
    role: {
      client: 'Kunde',
      supplier: 'Lieferant'
    }
  },

  people: {
    active: 'Aktiv',
    add_member_to_team: 'Mitarbeiter zum Team hinzufügen: ',
    delete_error: 'An error occured while deleting this person. There are probably data linked to it. Are you sure this person has no assignation or wrote no comment?',
    delete_text: 'Are you sure you want to remove {personName} from your database?',
    edit_title: 'Benutzer bearbeiten:',
    empty_team: 'There is no one listed in the project team.',
    new_person: 'Benutzer hinzufügen',
    no_task_assigned: 'Keine zugewiesenen Tasks',
    persons: 'Benutzer | Benutzer',
    running_tasks: 'Running tasks',
    select_person: 'Mitarbeiter auswählen...',
    team: 'Mitarbeiter',
    title: 'Benutzer',
    unactive: 'Inaktiv',
    csv: {
      import_file: 'Import a .csv file',
      export_file: 'Download as a .csv file',
      import_title: 'Import data from a CSV file',
      required_fields: 'Your CSV file requires the following columns',
      select_file: 'Please select a file from one of your folder:',
      error_upload: 'An error occured while uploading your CSV file.'
    },
    fields: {
      first_name: 'Vorname',
      last_name: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      role: 'Funktion',
      old_password: 'Aktuelles Passwort',
      password: 'Neues Passwort',
      password_2: 'Passwort wiederholen',
      active: 'Aktiv'
    },

    list: {
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      role: 'Funktion',
      active: 'Aktiv'
    },
    role: {
      admin: 'Admin',
      client: 'Kunde',
      manager: 'Produktionsleiter',
      user: 'Artist'
    }
  },

  playlists: {
    add_shots: 'Shots auswählen',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this playlist.',
    edit_title: 'Edit playlist',
    loading_error: 'A server error occured. Playlists cannot be loaded.',
    new_playlist: 'Playlist hinzufügen',
    no_playlist: 'There is currently no playlist for this project.',
    no_selection: '',
    no_sequence_for_episode: 'There is no sequence for this episode',
    no_shot_for_production: 'There is no shot for this production',
    no_shot_for_sequence: 'There is no shot for this sequence',
    select_shot: 'Please select a shot in the right column',
    select_playlist: 'Please select a playlist in the left column',
    title: 'Playlists',
    remove: 'remove',
    fields: {
      name: 'Name'
    }
  },

  productions: {
    sequence_management: 'Sequenzen',
    production_planning: 'Administration',
    production_management: 'Produktionsmanagement',
    task_type_planning: 'Todo-planung',
    task_status_planning: 'Todostatus-planung',
    asset_type_planning: 'Asset-planung',
    shot_management: 'Shots',
    asset_management: 'Assets',
    task_management: 'Todos',
    current: 'ausgewähltes Projekt',
    createfs_text: 'Ordner erstellen?',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this production. There are probably data linked to it. Are you sure this production has no task, shot or asset linked to it? Kitsu doesn\'t allow production deletion. If you don\'t want to see the production anymore, you can close it instead.',
    edit_title: 'Projekt bearbeiten',
    new_production: 'Projekt hinzufügen',
    number: 'Projekt | Projekte',
    open_productions: 'Meine Projekte',
    picture: 'Bild ändern',
    title: 'Projekte',
    home: {
      create_new: 'Neues Projekt erstellen',
      empty: 'Keine offenen Projekte vorhanden',
      no_task: 'Keine Tasks vorhanden',
      no_prod_for_client: 'You don\'t have access to any production. Contact your contractor to obtain an access.',
      title: 'Offene Projekte',
      welcome: 'Willkommen im Intranet'
    },
    fields: {
      fps: 'FPS',
      name: 'Name',
      ratio: 'Ratio',
      resolution: 'Resolution',
      status: 'Status',
      type: 'Typ'
    },
    metadata: {
      add_explaination: 'Add specific data required by this project.',
      add_failed: 'An error occured while adding metadata to your project.',
      add_new_values: 'There is currently no available values.',
      available_values: 'Available values',
      choices: 'List of values',
      delete_text: 'Are you sure you want to delete this column and related data for all assets of this production?',
      delete_error: 'An error occured while deleting this metadata column.',
      error: 'An error occured while adding the metadata column. Make sure there is no column with similar name and that all fields are filled. If the problem is persists, please contact the support team.',
      free: 'Free value',
      title: 'Add metadata column'
    },
    status: {
      closed: 'Abgeschlossen',
      open: 'Aktiv',
      active: 'Aktiv',
      archived: 'Archiviert'
    },
    type: {
      short: 'Short',
      featurefilm: 'Feature Film',
      tvshow: 'TV Show'
    }
  },

  profile: {
    info_title: 'Information',
    language: 'Sprache',
    password_title: 'Passwort ändern',
    timezone: 'Zeitzone',
    title: 'Profil',
    change_avatar: 'Avatar ändern',
    avatar: {
      title: 'Avatar ändern'
    },
    change_password: {
      button: 'Passwort ändern',
      error: 'An error occured while changing password. Please verify your current password.',
      success: 'Your password was successfully changed!',
      unvalid: 'Your new password confirmation doesn\'t match or your password is too short (7 chars, at least, is expected).'
    },
    save: {
      button: 'Save changes',
      error: 'An error occured while saving changes'
    }
  },

  settings: {
    change_logo: 'Logo ändern',
    logo: 'Studio Logo',
    no_logo: 'kein Logo ausgewählt.',
    set_logo: 'Logo auswählen',
    title: 'Einstellungen',
    fields: {
      name: 'Name des Studios',
      hours_by_day: 'Stunden pro Tag'
    },
    save: {
      button: 'Speichern',
      error: 'Fehler beim Speichern der Einstellungen'
    }
  },

  task_status: {
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this task status. There are probably data linked to it. Are you sure this task status has no task linked to it?',
    edit_title: 'Task Status bearbeiten',
    number: 'Task Status | Task Status',
    new_task_status: 'Task Status hinzufügen',
    title: 'Task Status',
    fields: {
      is_artist_allowed: 'kann Artist setzen',
      color: 'Farbe',
      is_done: 'ist final',
      is_reviewable: 'Wird abgenommen',
      is_retake: 'Hat Retakes',
      name: 'Name',
      short_name: 'Kürzel',
      priority: 'Priority'
    }
  },

  task_types: {
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this task type. There are probably data linked to it. Are you sure this task type has no task linked to it?',
    edit_title: 'Task Typ bearbeiten',
    new_task_type: 'Task Typ hinzufügen',
    number: 'Task Typ | Task Typen',
    title: 'Task Typen',
    fields: {
      dedicated_to: 'Für',
      color: 'Farbe',
      name: 'Name',
      allow_timelog: 'Zeiterfassung',
      priority: 'Priorität'
    }
  },

  sequences: {
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this sequence. There are probably data linked to it. Are you sure this sequence has no shot linked to it?',
    edit_title: 'Sequenz bearbeiten',
    empty_list: 'There is no sequence in the production. What about creating some?',
    empty_list_client: 'There is no sequence in this production.',
    new_sequence: 'Neue Sequenz',
    number: 'Sequenz | Sequenzen',
    title: 'Sequenzen',
    fields: {
      name: 'Name',
      description: 'Beschreibung',
      percent: '%',
      frames: 'Fr',
      seconds: 'Sek',
      minutes: 'Min',
      entities: 'St'
    }
  },

  shots: {
    casting: 'Shot casting',
    delete_text: 'Are you sure you want to remove {name} from your database?',
    delete_error: 'An error occured while deleting this shot. There are probably data linked to it. Are you sure this shot has no task linked to it?',
    edit_success: 'Shot {name} successfully edited.',
    edit_fail: 'Creation or edition failed, an error occured. Make sure that you are not renaming the shot with a name already listed for given sequence.',
    edit_title: 'Shot bearbeiten',
    empty_list: 'There is no shot in the production. What about creating some?',
    empty_list_client: 'There is no shot in this production.',
    information: 'Shot Infos',
    new_shot: 'Add a shot',
    new_shots: 'Add shots',
    new_sequences: 'Add sequences',
    new_episodes: 'Add episodes',
    no_casting: 'The shot casting is empty.',
    number: 'Shot | Shots',
    total_frames: 'Frame | Frames',
    manage: 'Create shots',
    task_display: 'Edit task display',
    new_success: 'Shot {name} successfully created.',
    restore_text: 'Are you sure you want to restore {name} into your database?',
    restore_error: 'An error occured while restoring this shot.',
    tasks: 'Task Infos',
    title: 'Shots',
    fields: {
      description: 'Beschreibung',
      episode: 'Episode',
      frame_in: 'In',
      frame_out: 'Out',
      fps: 'FPS',
      nb_frames: 'Shotlänge',
      time_spent: 'Arbeitszeit',
      due_date: 'Enddatum',
      name: 'Shot',
      production: 'Prod',
      sequence: 'Sequenz',
      total: 'TOTAL'
    }
  },

  server_down: {
    text: 'Please contact your vendor support, your system administrator or your IT department to understand what is going wrong.',
    title: 'Datenbank kann nicht erreicht werden'
  },

  tasks: {
    add_preview: 'Preview hinzufügen',
    add_preview_error: 'Fehler beim Hinzufügen von Preview',
    assign: 'Task zuweisen an: | {nbSelectedTasks} Tasks zuweisen an:',
    back_to_list: 'back to list',
    change_status_to: 'Task Status ändern zu:',
    change_preview: 'Preview ändern',
    change_priority: 'Priorität ändern zu:',
    checkout_version: 'Version auschecken',
    clear_assignations: 'clear assignations',
    create_for_selection: 'Create task for each empty cell:',
    create_tasks: 'Task hinzufügen',
    create_tasks_shot: 'Add tasks for current shots',
    create_tasks_shot_explaination: 'You are going to create a new task for each shot of current list for the given task type. Do you want to continue?',
    create_tasks_shot_failed: 'A server error occured while proceeding creations.',
    create_tasks_asset: 'Add tasks for current assets',
    create_tasks_asset_explaination: 'You are going to create a new task for each asset of current list for the given task type. Do you want to continue?',
    create_tasks_asset_failed: 'A server error occured while proceeding creations.',
    current: 'Offene Tasks',
    current_status: 'Aktueller Status:',
    delete_all_text: 'Are you sure you want to delete all tasks for given {name}? Please, confirm by typing the task type name of the tasks you want to delete in the text field.',
    delete_all_error: 'Deleting all tasks for given task type failed.',
    delete_error: 'Fehler beim Löschen des Tasks',
    delete_comment: 'Letzten Kommentar löschen?',
    delete_comment_error: 'Fehler beim Löschen des Kommentars.',
    delete_for_selection: 'Ausgewählte Tasks löschen:',
    delete_preview: 'Preview löschen?',
    delete_preview_error: 'An error occured while deleting preview.',
    delete_version: 'Version löschen',
    due_date: 'Enddatum',
    edit_comment: 'Kommentar bearbeiten',
    edit_title: 'Task bearbeiten',
    done: 'Fertig',
    download_pdf_file: 'Download .{extension} file',
    feedback: 'feedback',
    full_screen: 'Vollbild anzeigen',
    hide_assignations: 'Mitarbeiter ausblenden',
    hide_tasks: 'Tasks ausblenden',
    hide_due_dates: 'Enddaten ausblenden',
    hide_infos: 'Infos ausblenden',
    hide_sequence_stats: 'Statistiken ausblenden',
    my_tasks: 'Meine Todos',
    next: 'nächster Task',
    new_version: 'Neue Version',
    no_assignation_right: 'You are not allowed to manage assignations',
    no_comment: 'Keine Kommentare für diesen Task',
    no_preview: 'Keine Previews für diesen Task',
    number: 'Task | Tasks',
    preview: 'Previews',
    previous: 'vorheriger Task',
    unsubscribe_notifications: 'Benachrichtigungen kündigen',
    set_estimations: 'Einschätzung festlegen',
    set_preview: 'Preview als Thumbnail festlegen',
    set_preview_error: 'Fehler beim Setzen des Thumbnails',
    set_preview_done: 'Preview wird als Thumbnail benutzt',
    select_preview_file: 'Please select a picture from your hard drive to be used as a preview for the current task:',
    show_assignations: 'Mitarbeiter anzeigen',
    show_tasks: 'Tasks anzeigen',
    show_due_dates: 'Enddaten anzeigen',
    show_infos: 'Infos anzeigen',
    show_sequence_stats: 'Statistiken anzeigen',
    subscribe_notifications: 'Benachrichtigungen abonnieren',
    validation: 'Abnahme',
    working_files: 'Arbeitsdateien',
    tasks: 'Tasks',
    fields: {
      asset_type: 'Asset Typ',
      assignees: 'Mitarbeiter',
      end_date: 'Enddatum',
      duration: 'Dauer',
      entity: 'Entity',
      entity_name: 'Name',
      estimation: 'Einschätzung',
      last_comment: 'Letzter Kommentar',
      last_comment_date: 'Letzter Kommentar',
      priority: 'Priorität',
      production: 'Prod',
      start_date: 'Startdatum (Planung)',
      due_date: 'Enddatum (Planung)',
      real_end_date: 'Enddatum',
      real_start_date: 'Startdatum',
      retake_count: 'Retakes',
      sequence: 'Sequenz',
      task_status: 'Status',
      task_status_short_name: 'Status',
      task_type: 'Type'
    },
    priority: {
      emergency: 'Notfall',
      normal: 'Normal',
      high: 'Hoch',
      very_high: 'Sehr hoch'
    }
  },

  timesheets: {
    detail_level: 'Detail level',
    done_tasks: 'Erledigt Tasks',
    hours: 'Stunden',
    month: 'Monate',
    time_spents: 'Zeit in Stunden',
    title: 'Zeiterfassung',
    year: 'Jahr'
  }
}
