package com.hospital.backend.config;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DoctorSeeder {

    @Bean
    CommandLineRunner initDatabase(DoctorRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Fresh seed — insert new records
                repository.save(Doctor.builder()
                        .doctorName("Dr. Silva")
                        .specialization("Cardiologist")
                        .available(true)
                        .build());
                repository.save(Doctor.builder()
                        .doctorName("Dr. Perera")
                        .specialization("Dentist")
                        .available(false)
                        .build());
                System.out.println("Preloaded doctor data into the database successfully.");
            } else {
                // Sync availability for existing records by name
                repository.findAll().forEach(doctor -> {
                    if ("Dr. Silva".equals(doctor.getDoctorName())) {
                        doctor.setAvailable(true);
                        repository.save(doctor);
                    } else if ("Dr. Perera".equals(doctor.getDoctorName())) {
                        doctor.setAvailable(false);
                        repository.save(doctor);
                    }
                });
                System.out.println("Doctor availability synced successfully.");
            }
        };
    }
}
